import React from "react";
import styles from "./card.module.scss";
import Image from "next/image";
import Link from "next/link";
import cls from "classnames";

const Card = ({ name, imgUrl, href }) => {
  return (
    <Link href={href} className={styles.cardLink}>
      <div className={cls(styles.container, "glass")}>
        <div className={styles.cardHeaderWrapper}>
          <h2>{name}</h2>
        </div>
        <div className={styles.cardImageWrapper}>
          <Image src={imgUrl} width={260} height={160} alt="image" />
        </div>
      </div>
    </Link>
  );
};

export default Card;
