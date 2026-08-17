import { notFound } from "next/navigation";

import EditArticleForm from "@/features/articles/edit/components/EditArticleForm/EditArticleForm";

type Props = {
  params: Promise<{ articleId: string }>;
};

const EditArticlePage = async ({ params }: Props) => {
  const { articleId } = await params;

  if (!articleId) {
    notFound();
  }

  return <EditArticleForm articleId={articleId} />;
};

export default EditArticlePage;
