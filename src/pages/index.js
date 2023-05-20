import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import Banner from "@/components/banner";
import Card from "@/components/card";
import { fetchCoffeeStores } from "@/lib/coffee-stores";
import useTrackLocation from "@/hooks/useTrackLocation";
import { useContext, useEffect, useState } from "react";
import { ACTION_TYPES, StoreContext } from "../store/store-context";

// import coffeeStores from "../../data/coffee-stores.json";

export default function Home({ coffeeStores }) {
  const [nearbyStoresError, setNearbyStoreaError] = useState("");

  const { dispatch, state } = useContext(StoreContext);
  const { latLong, nearbyStores } = state;

  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();
  console.log(coffeeStores);
  const handleBannerOnClick = () => {
    handleTrackLocation();
  };
  console.log({ locationErrorMsg });

  useEffect(() => {
    if (latLong) {
      const getNearCoffeeStores = async () => {
        try {
          const nearbyStores = await fetchCoffeeStores(latLong, 30);
          dispatch({
            type: ACTION_TYPES.SET_NEARBY_STORES,
            payload: { nearbyStores },
          });
          setNearbyStoreaError("");
        } catch (error) {
          console.error(error);
          setNearbyStoreaError(error.message);
        }
      };
      getNearCoffeeStores();
    }
  }, [latLong, dispatch]);
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
          buttonText={isFindingLocation ? "Locating..." : "View stores nearby"}
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
        {locationErrorMsg}
        {nearbyStoresError}
        {Boolean(nearbyStores.length) && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>{nearbyStores[0].timezone}</h2>
            <div className={styles.cardLayout}>
              {nearbyStores.map((store) => {
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
          </div>
        )}
        {coffeeStores.length && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>{coffeeStores[0].timezone}</h2>
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
          </div>
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
