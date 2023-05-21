import { useRouter } from "next/router";
import Head from "next/head";
import cls from "classnames";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

import styles from "../../styles/coffee-strore.module.scss";
import { fetchCoffeeStores } from "@/lib/coffee-stores";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../store/store-context";
import { fetcher, isEmpty } from "@/utils";

const CoffeeStore = ({ coffeeStore }) => {
  const router = useRouter();
  const [newCoffeeStore, setNewCoffeStore] = useState(coffeeStore || {});
  const [votingCount, setVotingCount] = useState(0);
  const { id } = router.query;
  const {
    state: { nearbyStores },
  } = useContext(StoreContext);

  const handleCreateCoffeeStore = async (storeFromContext) => {
    const { fsq_id, imgUrl, location, name, timezone } = storeFromContext;
    try {
      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: String(fsq_id),
          imgUrl,
          address: location?.formatted_address || "",
          region: location?.region || "",
          name,
          timezone,
        }),
      });

      const dbCoffeeStore = await response.json();
    } catch (error) {
      console.error("Error creating coffee store:", error);
    }
  };

  useEffect(() => {
    if (coffeeStore) {
      if (isEmpty(coffeeStore)) {
        const newStore = nearbyStores.find((store) => store.fsq_id === id);
        if (newStore) {
          setNewCoffeStore(newStore);
          handleCreateCoffeeStore(newStore);
        }
      } else {
        handleCreateCoffeeStore(coffeeStore);
      }
    }
  }, [id, nearbyStores, coffeeStore]);

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  useEffect(() => {
    if (data && data.length > 0) {
      setNewCoffeStore(data[0]);
      setVotingCount(data[0].voting);
    }
  }, [data]);

  if (router.isFallback || !id) return <div>Loading...</div>;
  if (error) {
    console.error(error);
    return <p>Error with getting store</p>;
  }

  const handleUpvoteButton = async () => {
    try {
      const response = await fetch("/api/upvoteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const dbCoffeeStore = await response.json();
      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        setVotingCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error upvoting coffee store:", error);
    }
  };
  const {
    location: locationInfo,
    name,
    imgUrl,
    address,
    region,
  } = newCoffeeStore;
  const location = locationInfo || { formatted_address: address, region };
  return (
    <div>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">← Back to home</Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name || "Coffee Store"}
          />
        </div>

        <div className={cls("glass", styles.col2)}>
          {location && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/places.svg"
                width="24"
                height="24"
                alt="places icon"
              />
              <p className={styles.text}>{location.formatted_address}</p>
            </div>
          )}
          {location && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/nearMe.svg"
                width="24"
                height="24"
                alt="near me icon"
              />
              <p className={styles.text}>{location.region}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              width="24"
              height="24"
              alt="star icon"
            />
            <p className={styles.text}>{votingCount}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

/*=============================================
=            server side            =
=============================================*/

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();
  const paths = coffeeStores.map((store) => ({
    params: { id: store.fsq_id },
  }));
  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const coffeeStores = await fetchCoffeeStores();
  const id = params.id;
  const coffeeStore = coffeeStores.find((store) => store.fsq_id === id);
  return {
    props: {
      coffeeStore: coffeeStore || {},
    },
  };
}

export default CoffeeStore;
