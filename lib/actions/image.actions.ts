"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import User from "../database/models/user.model";
import Image from "../database/models/image.model";
import { redirect } from "next/navigation";
import { v2 as cloudinary } from "cloudinary";
const populateUser = (query: any) =>
  query.populate({
    path: "author",
    model: User,
    select: "_id firstName lastName clerkId",
  });

// ADD IMAGE
export async function addImage({ image, userId, path }: AddImageParams) {
  try {
    await connectToDatabase();

    const author = await User.findById(userId);

    if (!author) throw new Error("Author not found");

    const newImage = await Image.create({
      ...image,
      author: author._id,
    });

    revalidatePath(path);

    return JSON.parse(JSON.stringify(newImage));
  } catch (error) {
    handleError(error);
  }
}
// UPDATE IMAGE
export async function updateImage({ image, userId, path }: UpdateImageParams) {
  try {
    await connectToDatabase();

    const imageToUpdate = await Image.findById(image._id);

    if (!imageToUpdate || imageToUpdate.author.toHexString() !== userId)
      throw new Error("Unauthorized access or image not found");

    // By default, findByIdAndUpdate returns the document as it was BEFORE the update
    // {new: true} tells MongoDB to return the document AFTER the update is applied
    const updatedImage = await Image.findByIdAndUpdate(
      imageToUpdate._id,
      image,
      {
        new: true,
      }
    );

    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedImage));
  } catch (error) {
    handleError(error);
  }
}
// DELETE IMAGE
export async function deleteImage(imageId: string) {
  try {
    await connectToDatabase();

    await Image.findByIdAndDelete(imageId);
  } catch (error) {
    handleError(error);
  } finally {
    redirect("/");
  }
}
// GET IMAGE
export async function getImageById(imageId: string) {
  try {
    await connectToDatabase();

    const image = await populateUser(Image.findById(imageId));

    if (!image) throw new Error("Image not found");

    return JSON.parse(JSON.stringify(image));
  } catch (error) {
    handleError(error);
  }
}

// GET ALL IMAGES
export async function getAllImages({
  limit = 9,
  page = 1,
  searchQuery = "",
}: {
  limit?: number;
  page: number;
  searchQuery?: string;
}) {
  try {
    await connectToDatabase();

    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    let expression = "folder=image-ai-saas";
    let query: any = {};
    // TODO: add search by on the image, not jsut the title
    if (searchQuery) {
      // Format the search query for Cloudinary
      // This searches in the tags and context fields which are commonly used for searchable metadata
      // Removed '*' for partial matching as it caused syntax errors. Cloudinary might handle prefix matching automatically or require different syntax.
      // Consider reviewing Cloudinary search API docs for best practices on partial matching if needed.
      // Removed 'image_analysis.data.tags' as it's not supported by Cloudinary search API
      expression += ` AND (tags:${searchQuery} OR context.title:${searchQuery} OR context.alt:${searchQuery})`;

      // Also create a MongoDB query that will search in title and prompt fields
      query = {
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },
          { prompt: { $regex: searchQuery, $options: "i" } },
        ],
      };
    }

    // Get resources from Cloudinary
    const { resources } = await cloudinary.search
      .expression(expression)
      .execute();

    // If we have results from Cloudinary, add their IDs to our MongoDB query
    if (resources && resources.length > 0) {
      const resourceIds = resources.map((resource: any) => resource.public_id);

      if (searchQuery) {
        // Add publicId condition to our existing query
        query = {
          $or: [...(query.$or || []), { publicId: { $in: resourceIds } }],
        };
      } else {
        // If no search query, we can just use the resource IDs
        query = { publicId: { $in: resourceIds } };
      }
    }

    const skipAmount = (Number(page) - 1) * limit;

    const images = await populateUser(Image.find(query))
      .sort({ updatedAt: -1 })
      .skip(skipAmount)
      .limit(limit);

    const totalImages = await Image.find(query).countDocuments();
    const savedImages = await Image.find().countDocuments();

    return {
      data: JSON.parse(JSON.stringify(images)),
      totalPage: Math.ceil(totalImages / limit),
      savedImages,
    };
  } catch (error) {
    handleError(error);
  }
}

// GET IMAGES BY USER
export async function getUserImages({
  limit = 9,
  page = 1,
  userId,
}: {
  limit?: number;
  page: number;
  userId: string;
}) {
  try {
    await connectToDatabase();

    const skipAmount = (Number(page) - 1) * limit;

    const images = await populateUser(Image.find({ author: userId }))
      .sort({ updatedAt: -1 })
      .skip(skipAmount)
      .limit(limit);

    const totalImages = await Image.find({ author: userId }).countDocuments();

    return {
      data: JSON.parse(JSON.stringify(images)),
      totalPages: Math.ceil(totalImages / limit),
    };
  } catch (error) {
    handleError(error);
  }
}