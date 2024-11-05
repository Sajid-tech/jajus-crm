import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../../base/BaseUrl";
import Layout from "../../layout/Layout";
import Fields from "../../common/TextField/TextField";

const status = [
    {
      value: "Active",
      label: "Active",
    },
    {
      value: "Inactive",
      label: "Inactive",
    },
  ];

const EditProduct = () => {
  const navigate = useNavigate();


  const {id} = useParams();

  const [product_type, setproductType] = useState({
    product_type: "",
    product_type_group: "",
    product_type_status: ""
});




  const [isButtonDisabled, setIsButtonDisabled] = useState(false);


useEffect(() => {

    axios({
        url: BASE_URL+"/api/web-fetch-product-type-by-id/" + id,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => {
        
        setproductType(res.data?.product_type)
  
      });
    }, []);

    const onInputChange = (e) => {
        setproductType({
            ...product_type,
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
        product_type: product_type.product_type,
        product_type_group: product_type.product_type_group,
        product_type_status: product_type.product_type_status, 
    };
    try {
      const response = await axios.put(
        `${BASE_URL}/api/web-update-product-type/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code == 200) {
        toast.success("Product Type is Updated Successfully");
        navigate("/product");
      } else {
        if (response.data.code == 401) {
          toast.error("Product Type Duplicate Entry");
        } else if (response.data.code == 402) {
          toast.error("Product Type Duplicate Entry");
        } else {
          toast.error("An unknown error occurred");
        }
      }
    } catch (error) {
      console.error("Error updating Product Type:", error);
      toast.error("Error  updating Product Type");
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
          Edit Product Type
          </h1>
        </div>
        <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
          <form onSubmit={onSubmit} autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="form-group ">
                <Fields
                  required={true}
                  types="text"
                  title="Product Type"
                  type="textField"
                  autoComplete="Name"
                  name="product_type_group"
                                            value={product_type.product_type_group}
                                            onChange={(e) => onInputChange(e)}
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
                  value={product_type.product_type}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
              <div className="form-group">
                <Fields
                  required={true}
                  title="Status"
                  type="whatsappDropdown"
                  autoComplete="Name"
                   name="product_type_status"
                  value={product_type.product_type_status}
                  onChange={(e) => onInputChange(e)} 

                  options={status}
                />
              </div>
            </div>
            <div className="mt-4 ">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                disabled={isButtonDisabled}
              >
                {isButtonDisabled ? "Updating..." : "Update"}
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

export default EditProduct;
