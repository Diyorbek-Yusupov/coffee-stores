import { useRouter } from "next/router";
import Head from "next/head";
import cls from "classnames";
import Image from "next/image";
import Link from "next/link";

import styles from "../../styles/coffee-strore.module.scss";
import { fetchCoffeeStores } from "@/lib/coffee-stores";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../store/store-context";
import { isEmpty } from "@/utils";

const CoffeeStore = ({ coffeeStore }) => {
  const router = useRouter();
  const [newCoffeeStore, setNewCoffeStore] = useState(coffeeStore);
  const { id } = router.query;
  const {
    state: { nearbyStores },
  } = useContext(StoreContext);
  console.log(id);
  useEffect(() => {
    if (coffeeStore) {
      if (isEmpty(coffeeStore)) {
        const newStore = nearbyStores.find((store) => store.fsq_id === id);
        console.log(newStore);
        setNewCoffeStore(newStore);
      }
    }
  }, [id, nearbyStores, coffeeStore]);

  const handleUpvoteButton = () => {
    console.log("handle upvote");
  };
  if (router.isFallback) return <div>Loading...</div>;

  const { location, name, imgUrl } = newCoffeeStore;

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
            <p className={styles.text}>1</p>
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
