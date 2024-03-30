import axios from "axios";
import { useSearch } from "../../context/search";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const [values, setValues] = useSearch(); // context
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(`/products/search/${values?.keyword}`);
      // console.log(data);
      setValues({ ...values, results: data });
      navigate("/search");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form className="d-flex" onSubmit={handleSubmit}>
      <input
        type="search"
        style={{ borderRadius: "0px" }}
        className="form-control"
        placeholder="Search"
        onChange={(e) => setValues({ ...values, keyword: e.target.value })}
        value={values.keyword}
      />
      <button
        className="btn btn-outline-primary"
        type="submit"
        style={{ borderRadius: "0px" }}
      >
        Search
      </button>
    </form>
  );
}

// import axios from "axios";
// import { useState } from "react";

// export default function Search() {
//   const [keyword, setKeyword] = useState("");
//   const [results, setResults] = useState([]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await axios.get(`/products/search/${keyword}`);
//       // console.log(data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <form className="d-flex" onSubmit={handleSubmit}>
//       <input
//         type="Search"
//         style={{ borderRadius: "0px" }}
//         className="form-control"
//         placeholder="Your fav books.."
//         onChange={(e) => setKeyword(e.target.value)}
//         value={keyword}
//       />
//       <button
//         className="btn btn-outline-primary"
//         type="submit"
//         style={{ borderRadius: "0px" }}
//       >
//         Search
//       </button>
//     </form>
//   );
// }
