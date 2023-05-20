import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import Banner from "@/components/banner";
import Card from "@/components/card";
import { fetchCoffeeStores } from "@/lib/coffee-stores";

// import coffeeStores from "../../data/coffee-stores.json";

export default function Home({ coffeeStores }) {
  console.log(coffeeStores);
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
            priority
          />
        </div>
        {coffeeStores.length && (
          <>
            <h2 className={styles.heading2}>{coffeeStores.timezone}</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((store) => {
                return (
                  <Card
                    key={store.fsq_id}
                    name={store.name}
                    href={`coffee-store/${store.fsq_id}`}
                    imgUrl={
                      store.imgUrl ||
                      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                    }
                    className={styles.card}
                  />
                );
              })}
            </div>
          </>
        )}
      </main>
    </>
  );
}

/*=============================================
=            server side            =
=============================================*/

export async function getStaticProps() {
  const coffeeStores = await fetchCoffeeStores();

  return {
    props: { coffeeStores },
  };
}
