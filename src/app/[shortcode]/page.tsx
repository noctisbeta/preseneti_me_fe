import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ shortcode: string }>;
}) {
  const slug = (await params).shortcode;
  console.log(slug);
  redirect(`https://api.preseneti.me/${slug}`);
}
