import Header from "@/components/shared/Header";
import TransformationForm from "@/components/shared/TransformationForm";
import { transformationTypes } from "@/constants";
import { getUserById } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const AddTransformationTypePage = async ({ params }: SearchParamProps) => {
  const { id, type } = await params;

  const { userId } = await auth();
  const transformation = transformationTypes[type];

  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);


  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />

      <TransformationForm action="Add" userId={user._id} type={transformation.type as TransformationTypeKey} creditBalance={user.creditBalance}  />
    </>
  );
};

export default AddTransformationTypePage;
