import { redirect } from "next/navigation";

interface PageProps {
  params: {
    shortcode: string;
  };
}

export default async function ShortcodePage({ params }: PageProps) {
  const { shortcode } = params;

  redirect(`https://api.preseneti.me/${shortcode}`);
}
