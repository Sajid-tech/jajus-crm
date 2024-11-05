import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
// import Select from "react-select";
import { toast } from "react-toastify";
import BASE_URL, { baseURL } from "../../base/BaseUrl";
import { IconButton, MenuItem, TextField } from "@mui/material";
import { Delete } from "@mui/icons-material";
import Layout from "../../layout/Layout";
// import "./dailyBook.css";

const AddPurchaseTiles = (props) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  var midate = "04/04/2022";
  var todayback = yyyy + "-" + mm + "-" + dd;

  const [purchase, setPurchaseTiles] = useState({
    purchase_date: todayback,
    purchase_year: "2023-24",
    purchase_type: "Tiles",
    purchase_supplier: "",
    purchase_bill_no: "",
    purchase_other: "0",
    purchase_amount: "0",
    purchase_estimate_ref: "",
    purchase_no_of_count: "",
    purchase_sub_data: "",
    
});
const [isButtonDisabled, setIsButtonDisabled] = useState(false);


const useTemplate = {purchase_sub_item:"",  purchase_sub_qnty:"0",purchase_sub_qnty_sqr:"0",purchase_sub_rate:"0",purchase_sub_amount:"0"};
    
const [users, setUsers] = useState([useTemplate]);

const [purchase__count, setCount] = useState(1);

const addItem = () => {
    setUsers([...users,useTemplate]);
    setCount(purchase__count + 1);
};

const onChange = (e, index) =>{
    const updatedUsers = users.map((user, i) => 
    index == i 
    ? Object.assign(user,{[e.target.name]: e.target.value}) 
    : user );
    setUsers(updatedUsers);
};

const removeUser = (index) => {
    const filteredUsers = [...users];
    filteredUsers.splice(index, 1);
    setUsers(filteredUsers);
    setCount(purchase__count - 1);
};

const validateOnlyDigits = (inputtxt) => {
    var phoneno = /^\d+$/;
    if(inputtxt.match(phoneno) || inputtxt.length==0){
      return true;
    }else{
      return false;
    }
}

const validateOnlyNumber = (inputtxt) => {
    var phoneno = /^\d*\.?\d*$/;
    if(inputtxt.match(phoneno) || inputtxt.length==0){
      return true;
    }else{
        return false;
    }
}

const [estimate_ref, setEstimateRef] = useState([]);
useEffect(() => {
    var theLoginToken = localStorage.getItem('login');   
    
    const requestOptions = {
            method: 'GET', 
            headers: {
               'Authorization': 'Bearer '+theLoginToken
            }             
    };     


    fetch(baseURL+'/web-fetch-estimate', requestOptions)
    .then(response => response.json())
    .then(data => setEstimateRef(data.estimate_no)); 
  }, []);

  const [estimate_sub, setEstimateSub] = useState([]);
useEffect(() => {
    var theLoginToken = localStorage.getItem('login');   
    
    const requestOptions = {
            method: 'GET', 
            headers: {
               'Authorization': 'Bearer '+theLoginToken
            }             
    };     


    fetch(baseURL+'/web-fetch-estimate-sub/'+purchase.purchase_estimate_ref, requestOptions)
    .then(response => response.json())
    .then(data => setEstimateSub(data.estimateSub)); 
  }, [purchase.purchase_estimate_ref]);

const onInputChange = (e) => {
    if(e.target.name=="purchase_amount"){
        if(validateOnlyNumber(e.target.value)){
            setPurchaseTiles({
            ...purchase,
            [e.target.name]: e.target.value,
          });
        }
    }else if(e.target.name=="purchase_other"){
        if(validateOnlyNumber(e.target.value)){
            setPurchaseTiles({
            ...purchase,
            [e.target.name]: e.target.value,
          });
        }
        
        const total = parseInt(e.target.value || 0)  + parseInt(purchase.purchase_amount || 0) ;
        setPurchaseTiles(purchase => ({
            ...purchase,
            purchase_amount: total
        }));
    }else{
        setPurchaseTiles({
            ...purchase,
            [e.target.name]: e.target.value,
        });
    }
};

const QntyCal = (selectedValue) => {
    const tempUsers = [...users];
    tempUsers[selectedValue].purchase_sub_amount = tempUsers[selectedValue].purchase_sub_qnty * tempUsers[selectedValue].purchase_sub_rate;
    setUsers(tempUsers);

    const result = [];

    for (let i = 0; i < users.length; i++) {
        result.push(users[i].purchase_sub_qnty * users[i].purchase_sub_rate);
    }

    const total = result.reduce((acc, curr) => acc + curr, 0) + parseInt(purchase.purchase_other || 0);
    
    setPurchaseTiles(purchase => ({
        ...purchase,
        purchase_amount: total
    }));
    
}

const RateCal = (selectedValue) => {
    const tempUsers = [...users];
    tempUsers[selectedValue].purchase_sub_amount = tempUsers[selectedValue].purchase_sub_qnty * tempUsers[selectedValue].purchase_sub_rate;
    setUsers(tempUsers);

    const result = [];

    for (let i = 0; i < users.length; i++) {
        result.push(users[i].purchase_sub_qnty * users[i].purchase_sub_rate);
    }

    const total = result.reduce((acc, curr) => acc + curr, 0) + parseInt(purchase.purchase_other || 0);
    
    setPurchaseTiles(purchase => ({
        ...purchase,
        purchase_amount: total
    }));
}

  const onSubmit = (e) => {
    let data = {
      purchase_date: purchase.purchase_date,
      purchase_year: purchase.purchase_year,
      purchase_type: purchase.purchase_type,
      purchase_supplier: purchase.purchase_supplier,
      purchase_bill_no: purchase.purchase_bill_no,
      purchase_other: purchase.purchase_other,
      purchase_amount: purchase.purchase_amount,
      purchase_no_of_count: purchase__count,
      purchase_estimate_ref: purchase.purchase_estimate_ref,
      purchase_sub_data: users,
    };
    e.preventDefault();
    var v = document.getElementById("addIndiv").checkValidity();
    var v = document.getElementById("addIndiv").reportValidity();
    if (v) {
      setIsButtonDisabled(true);
      axios({
        url: baseURL + "/web-create-purchase",
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => {
        if (res.data.code == "200") {
          toast.success("Purchase Created Sucessfully");
          navigate("/purchase-sale-list");
        } else {
          toast.error("Purchase Created for a day");
          setIsButtonDisabled(false);
        }
      });
    }
  };

  return (
    <Layout>
      <div>
        <div className="flex mb-4 mt-6">
          <h1 className="text-2xl text-[#464D69] font-semibold ml-2 content-center">
            Add Purchase Tiles
          </h1>
        </div>
        <div className="row">
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <form id="addIndiv" autoComplete="off">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="form-group">
                      <TextField
                        fullWidth
                        required
                        type="date"
                        label="Date"
                        autoComplete="Name"
                        name="purchase_date"
                        value={purchase.purchase_date}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>

                    <div className="form-group">
                      <TextField
                        fullWidth
                        required
                        disable
                        label="Supplier"
                        autoComplete="Name"
                        name="purchase_supplier"
                                                value={purchase.purchase_supplier}
                                                onChange={(e) => onInputChange(e)}
                      />
                    </div>

                    <div className="form-group">
                      <TextField
                        fullWidth
                        required
                        disabled
                        label="Ref Bill No"
                        autoComplete="Name"
                        name="purchase_bill_no"
                        value={purchase.purchase_bill_no}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="form-group">
                      <TextField
                        fullWidth
                        required
                        disabled
                        label="Other Amount"
                        autoComplete="Name"
                        name="purchase_other"
                        value={purchase.purchase_other}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>
                    <div className="form-group">
                      <TextField
                        fullWidth
                        required
                        disabled
                        label="Total Amount"
                        autoComplete="Name"
                        name="purchase_amount"
                                                value={purchase.purchase_amount}
                                                onChange={(e) => onInputChange(e)}
                      />
                    </div>
                    <div className="form-group">
                      <TextField
                        fullWidth
                        label="Estimate Ref"
                        autoComplete="Name"
                        required
                        SelectProps={{
                          MenuProps: {},
                        }}
                        select
                        name="purchase_estimate_ref"
                        value={purchase.purchase_estimate_ref}
                        onChange={(e) => onInputChange(e)}
                      >
                        {estimate_ref.map((fabric, key) => (
                                                    <MenuItem key={fabric.estimate_ref} value={fabric.estimate_ref}>
                                                        {fabric.estimate_ref}
                                                    </MenuItem>
                                                ))}
                     
                      </TextField>

                    
                    </div>
                  </div>
                  <hr />
                  <div className="row mb-4 mt-3">
                    <div className="col-sm-12 col-md-4 col-xl-6">
                      {users.map((user, index) => (
                        <div className="row " key={index}>
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
                            <div className="form-group">
                              <TextField
                                fullWidth
                                label="Item"
                                autoComplete="Name"
                                ref={inputRef}
                                required
                                name="purchase_sub_item"
                                                        value={user.purchase_sub_item}
                                                        onChange={e => onChange(e, index)}
                              />
                            </div>
                            <div className="form-group">
                              <TextField
                                fullWidth
                                label="Qnty"
                                autoComplete="Name"
                                ref={inputRef}
                                required
                                name="purchase_sub_qnty"
                                value={user.purchase_sub_qnty}
                                onChange={e => {onChange(e, index); QntyCal(index)}}
                              />
                            </div>
                            <div className="form-group">
                              <TextField
                                fullWidth
                                label="Rate"
                                autoComplete="Name"
                                ref={inputRef}
                                required
                                name="purchase_sub_rate"
                                                        value={user.purchase_sub_rate}
                                                        onChange={e => {onChange(e, index); RateCal(index) }}
                              />
                            </div>{" "}
                            <div className="form-group">
                              <TextField
                                fullWidth
                                label="Amount"
                                autoComplete="Name"
                                ref={inputRef}
                                required
                                name="purchase_sub_amount"
                                value={user.purchase_sub_amount}
                                onChange={e => onChange(e, index)}
                              />
                            </div>
                            <div className="col-sm-12 col-md-12 col-xl-1">
                            <IconButton onClick={() => removeUser(index)}>
                                <Delete />
                              </IconButton>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="row mt-4">
                        <div className="col-sm-12 col-md-12 col-xl-12">
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                            color="primary"
                            variant="contained"
                            oonClick={(e) => addItem(e)}
                          >
                            Add More
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row mt-4">
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                        color="primary"
                        onClick={(e) => onSubmit(e)}
                        disabled={isButtonDisabled}
                      >
                        Submit
                      </button>
                    <Link to="/purchase-sale-list">
                      <Button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddPurchaseTiles;
