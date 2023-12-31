"use client";

import Image from "next/image";
import { IoIosStar, IoMdCart } from "react-icons/io";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { calculatePercentage } from "@/backend/helpers";
import FormattedPrice from "@/backend/helpers/FormattedPrice";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/shoppingSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ProductCard = ({ item }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const startArray = Array.from({ length: item?.rating }, (_, index) => (
    <span key={index} className='text-yellow-500'>
      <IoIosStar />
    </span>
  ));

  return (
    <div className='max-w-[350px] maxmd:max-w-[100%] overflow-hidden '>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.0 }}
        className='border-[1px] rounded-sm'
      >
        <Link href={`/producto/${item._id}`}>
          <div className='w-full h-[300px] group overflow-hidden relative'>
            <Image
              src={item?.images[0].url}
              alt='product image'
              className='grayscale hover:grayscale-0 ease-in-out duration-500 w-full h-full object-cover group-hover:scale-110 rounded-t-sm'
              width={350}
              height={350}
            />

            {item?.sale_price && (
              <span className='absolute top-2 right-2  border-[1px] border-black font-medium text-xs py-1 px-3 rounded-sm bg-black text-slate-100 group-hover:bg-slate-100 group-hover:text-black duration-200'>
                Oferta
              </span>
            )}
            {item?.sale_price ? (
              <div>
                <div className='absolute top-2 left-2  border-[1px] border-black w-fit py-1 px-4 rounded-sm text-xs bg-black text-slate-100 group-hover:bg-slate-100 group-hover:text-black duration-200'>
                  <p>
                    {calculatePercentage(item?.price, item?.sale_price)}% menos
                  </p>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </Link>
        <div className=' px-4 py-4 flex flex-col bg-gray-100 rounded-b-sm'>
          {/* star icons
            <div className="flex items-center gap-x-1">{startArray}</div> */}
          <p className='text-black tracking-widest font-EB_Garamond text-xl'>
            {item?.title.substring(0, 20) + "..."}
          </p>

          <div className='pricing-class flex fle-row items-center gap-x-2'>
            <div className='flex flex-col gap-y-1'>
              <p className='font-semibold text-black tracking-wider text-xl'>
                {item?.sale_price > 0 ? (
                  <FormattedPrice amount={item?.sale_price} />
                ) : item?.price > 0 ? (
                  <FormattedPrice amount={item?.price} />
                ) : (
                  ""
                )}
              </p>
            </div>
            {item?.sale_price ? (
              <div>
                <div className='flex items-center gap-x-2'>
                  <p className='line-through text-sm text-black font-bodyFont'>
                    <FormattedPrice amount={item?.price} />
                  </p>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className=''>
            <p className='text-xs text-black'>Resérvalo por solo: </p>
            <p className='font-semibold text-black tracking-wider'>
              <FormattedPrice
                amount={
                  item?.price > 0
                    ? item?.price * 0.3
                    : item?.sale_price ?? item?.sale_price * 0.3
                }
              />{" "}
              (30%)
            </p>
          </div>
          <div className='flex items-center justify-between my-5'>
            {/* add to cart button */}
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.9 }}
              className='bg-black px-4 py-2 text-sm flex flex-row justify-between gap-x-2 items-center tracking-wide rounded-sm text-slate-100 hover:bg-black hover:text-white duration-500'
              onClick={() =>
                dispatch(addToCart(item)) &&
                toast.success(
                  `${item?.title.substring(0, 15)} se agrego al carrito!`,
                  {
                    position: toast.POSITION.TOP_CENTER,
                    className: "foo-bar",
                    theme: "dark",
                    transition: Bounce,
                  }
                ) &&
                router.push("/carrito")
              }
            >
              Agregar a carrito
              <IoMdCart className='' />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductCard;
