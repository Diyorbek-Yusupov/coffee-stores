import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import Banner from "@/components/banner";

export default function Home() {
  const handleBannerOnClick = () => {
    console.log("Banner click");
  };
  return (
    <>
      <Head>
        <title>Coffee Connoiseur</title>
        <meta name="description" content="Discover your coffee store" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main}`}>
        <Banner
          buttonText="View stores nearby"
          handleOnClick={handleBannerOnClick}
        />
        <div className={styles.heroImage}>
          <Image
            src={"/static/hero-image.png"}
            height={400}
            width={700}
            alt="hero image"
          />
        </div>
      </main>
    </>
  );
}
