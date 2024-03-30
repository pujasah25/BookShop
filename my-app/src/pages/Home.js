import { useEffect, useState } from "react";
import Jumbotron from "../components/cards/Jumbotron";
import axios from "axios";
import ProductCard from "../components/cards/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]); // 3 product obj  will be there at first
  const [total, setTotal] = useState(0); // 8 in total we have
  const [page, setPage] = useState(1); //
  const [loading, setLoading] = useState(false); // if we change page

  // useEffect(() => {
  //   loadProducts();
  // }, []);

  // console.log("products: ", products); // Array(3)
  // console.log("total: ", total); // 8

  useEffect(() => {
    loadProducts(); // on page mount, with 3 product
    getTotal();
  }, []);

  // execute this function only when page changes, mns we click on LoadMore button
  useEffect(() => {
    if (page === 1) return; // as we don't want to execute this function on page mounts
    loadMore();
  }, [page]);

  const getTotal = async () => {
    try {
      const { data } = await axios.get("/products-count");
      setTotal(data); // first = 0, now 8 on mount
    } catch (err) {
      console.log(err);
    }
  };

  const loadProducts = async () => {
    try {
      // const { data } = await axios.get("/products");
      const { data } = await axios.get(`/list-products/${page}`);
      setProducts(data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/list-products/${page}`);
      setProducts([...products, ...data]); // keep the old one and add new
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const arr = [...products];
  const sortedBySold = arr?.sort((a, b) => (a.sold < b.sold ? 1 : -1));

  return (
    <div style={{ overflowX: "hidden" }}>
      <Jumbotron
        title="Welcome to ProShop"
        sutTitle="Shop Your Favourite Book Now"
      />

      <div className="row px-2">
        <div className="col-md-6">
          <h2 className="p-3 mt-2 mb-2 h4 bg-light text-center">
            New Arrivals
          </h2>
          <div className="row">
            {products?.map((p) => (
              <div className="col-md-6" key={p._id}>
                <ProductCard p={p} />
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-6">
          <h2 className="p-3 mt-2 mb-2 h4 bg-light text-center">
            Best Sellers
          </h2>
          <div className="row">
            {sortedBySold?.map((p) => (
              <div className="col-md-6" key={p._id}>
                <ProductCard p={p} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container text-center p-5">
      {/* // atleast 1 product should be there, in products Arr to show LoadMore button */}
        {products && products.length < total && ( 
          <button
            className="btn btn-warning btn-lg col-md-6"
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              setPage(page + 1);
            }}
          >
            {loading ? "Loading..." : "Load more"}
          </button>
        )}
      </div>
    </div>
  );
}
