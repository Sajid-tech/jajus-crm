import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import { Input } from "@material-tailwind/react";
import BASE_URL from "../../base/BaseUrl";
import Layout from "../../layout/Layout";
import Fields from "../../common/TextField/TextField";
import ProductFilter from "../../components/ProductFilter";



const AddProduct = () => {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    product_type: "",
    product_type_group: "",
  });




  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
//   useEffect(() => {
//     const isLoggedIn = localStorage.getItem("id");
//     if (!isLoggedIn) {
//       navigate("/");
//       return;
//     }
//   }, []);



  const onUserInputChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };


  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setIsButtonDisabled(true);
    const formData = {
        product_type: product.product_type,
        product_type_group: product.product_type_group,
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/api/web-create-product-type`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code == 200) {
        toast.success("Product is Updated Successfully");
        navigate("/product");
      } else {
        if (response.data.code == 401) {
          toast.error("Product Duplicate Entry");
        } else if (response.data.code == 402) {
          toast.error("Product Duplicate Entry");
        } else {
          toast.error("An unknown error occurred");
        }
      }
    } catch (error) {
      console.error("Error updating Product:", error);
      toast.error("Error  updating Product");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <Layout>
      <div>
        {/* Title */}
        <div className="flex mb-4 mt-6">
          <h1 className="text-2xl text-[#464D69] font-semibold ml-2 content-center">
          Add Product Type
          </h1>
        </div>
        <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
          <form onSubmit={onSubmit} autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="form-group ">
                <Fields
                  required={true}
                  types="text"
                  title="Product Type"
                  type="textField"
                  autoComplete="Name"
                  name="product_type_group"
                  value={product.product_type_group}
                  onChange={(e) => onUserInputChange(e)}
                />
              </div>
              <div className="form-group">
                <Fields
                  required={true}
                  types="text"
                  title="Product"
                  type="textField"
                  autoComplete="Name"
                  name="product_type"
                  value={product.product_type}
                  onChange={(e) => onUserInputChange(e)}
                />
              </div>
            </div>
            <div className="mt-4 ">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                disabled={isButtonDisabled}
              >
                {isButtonDisabled ? "Submiting..." : "Submit"}
              </button>
              <Link to="/product">
                <button className="bg-green-500 text-white px-4 py-2 rounded-md">
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddProduct;
