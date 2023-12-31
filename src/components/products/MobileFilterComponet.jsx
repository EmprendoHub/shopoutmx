"use client";
import styles from "./filterstyle.module.scss";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import FilterMenuComponent from "./FilterMenuComponent";
import { CiShare2 } from "react-icons/ci";
import { toast } from "react-toastify";

const MobileFilterComponet = ({ allBrands, allCategories, lang }) => {
  const [isActive, SetIsActive] = useState(false);
  const pathname = usePathname();

  const copyToClipboard = () => {
    const url = location.href;
    navigator.clipboard.writeText(url);
    toast.success(`Link was successfully copied to your clipboard`);
  };

  useEffect(() => {
    if (isActive) SetIsActive(false);
  }, [pathname]);

  return (
    <div className='px-40 maxmd:px-2 w-[90%] maxsm:w-full mb-5'>
      <div
        className={`mt-5 p-3 border border-gray-200 text-center w-full justify-between flex mx-auto `}
      >
        <div
          className={`${styles.header} burger-class flex flex-row justify-between text-gray-600 items-center w-full`}
        >
          <div
            className='flex flex-row items-center gap-x-2 cursor-pointer'
            onClick={copyToClipboard}
          >
            <CiShare2 className='text-xl' />
            Compartir
          </div>
          <div
            onClick={() => {
              SetIsActive(!isActive);
            }}
            className={styles.button}
          >
            Filtrar
            <div
              className={`${styles.burger} ${
                isActive ? styles.burgerActive : ""
              }`}
            ></div>
          </div>
        </div>
      </div>
      <AnimatePresence mode='wait'>
        {isActive && (
          <FilterMenuComponent
            allBrands={allBrands}
            allCategories={allCategories}
            SetIsActive={SetIsActive}
            isActive={isActive}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileFilterComponet;
