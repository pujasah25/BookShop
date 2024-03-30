import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import AdminMenu from "../../components/nav/AdminMenu";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import CategoryForm from "../../components/forms/CategoryForm";
import { Modal } from "antd";

export default function AdminCategory() {
  const [auth] = useAuth(); // context
  const [cat, setCat] = useState("");
  const [categories, setCategories] = useState([]); // to store all the cateogry
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);
  const [updatedCat, setUpdatedCat] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data } = await axios.get("/categories");
      setCategories(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/category", { name: cat });
      if (data?.error) {
        toast.error(data.error);
      } else {
        loadCategories(); // to see the added category immidiately without page refresh
        setCat("");
        toast.success(`"${data.name}" is created`);
      }
    } catch (err) {
      console.log(err);
      toast.error("Create category failed. Try again.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/category/${selectedCat._id}`, {
        name: updatedCat, // in api, we saved cat as name
      });
      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(`"${data.name}" is updated`);
        setSelectedCat(null);
        setUpdatedCat("");
        loadCategories(); //
        setIsModalOpen(false); // to close the modal
      }
    } catch (err) {
      console.log(err);
      toast.error("Category may already exist. Try again.");
    }
  };
 // console.log("selectedCat: ", selectedCat);
 // console.log("updatedCat: ", updatedCat);
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.delete(`/category/${selectedCat._id}`);
      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(`"${data.name}" is deleted`);
        setSelectedCat(null);
        loadCategories();
        setIsModalOpen(false);
      }
    } catch (err) {
      console.log(err);
      toast.error("Category may already exist. Try again.");
    }
  };
  return (
    <>
      <Jumbotron
        title={`Hello ${auth?.user?.name}`}
        subTitle="Admin Dashboard"
      />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="p-3 mt-2 mb-2 h4 bg-light">Manage Categories</div>
            <CategoryForm
              value={cat}
              setValue={setCat}
              handleSubmit={handleSubmit}
            />
            <hr />
            <div className="col">
              {categories?.map((c) => (
                <button
                  key={c._id}
                  className="btn btn-outline-primary m-3"
                  onClick={() => {
                    setIsModalOpen(true);
                    setSelectedCat(c);
                    setUpdatedCat(c.name);
                  }}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <Modal
              open={isModalOpen}
              onOk={() => setIsModalOpen(false)}
              onCancel={() => setIsModalOpen(false)}
              footer={null} // this won't show the ok and cancel button
            >
              <CategoryForm
                value={updatedCat}
                setValue={setUpdatedCat}
                handleSubmit={handleUpdate}
                buttonText="Update"
                handleDelete={handleDelete}
              />
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
}
