import {
  Box,
  Checkbox,
  FormControl,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  Popover,
  Select,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Input } from "@material-tailwind/react";
import { useState } from "react";

const Fields = (props) => {


  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedValue, setSelectedValue] = useState(props.value || "");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (event, newValue) => {
    if (newValue !== null) {
      setSelectedValue(newValue);
      props.onChange && props.onChange(event, newValue); // Call parent's onChange handler if provided
    }
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'custom-dropdown-popover' : undefined;
  return (
    <>
      {props.type === "newwhatsappDropdown" && (
        <FormControl fullWidth sx={{ marginBottom: 0 }}>
          <InputLabel shrink={true} sx={{ mb: 0, position: "relative" }}>
            <span className="text-xl">
              {props.title}{" "}
              {props.required ? <span className="text-red-700">*</span> : null}
            </span>
          </InputLabel>

          <ToggleButtonGroup
            value={props.value}
            exclusive
            onChange={(event, newAlignment) => {
              props.onChange({ target: { name: props.name, value: newAlignment } });
            }}
            aria-label="text alignment"
            sx={{
              display: "flex",
              borderRadius: "5px",
            }}
          >
            {props.options?.map((data, key) => (
              <ToggleButton
                className="!p-1 !px-4"
                key={key}
                value={data.value}
                sx={{
                  fontSize: "13px",
                  color: props.value === data.value ? "white" : "inherit",
                  backgroundColor: props.value === data.value ? "#1C64F2" : "#1c64f24d",
                  "&:hover": {
                    backgroundColor: "#1c64f24d", 
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#1C64F2", 
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#1654C0", 
                    },
                  },
                }}
              >
                {data.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </FormControl>
      )}
      {props.type === "transactionDropdown" && (
        <FormControl fullWidth sx={{ marginBottom: 0 }}>
          <InputLabel shrink={true} sx={{ mb: 0, position: "relative" }}>
            <span className="text-xl">
              {props.title}{" "}
              {props.required ? <span className="text-red-700">*</span> : null}
            </span>
          </InputLabel>

          <ToggleButtonGroup
             value={props.value}
            exclusive
            onChange={(event, newAlignment) => {
              props.onChange({ target: { name: props.name, value: newAlignment } });
            }}
            aria-label="text alignment"
            sx={{
              display: "flex",
              borderRadius: "5px",
            }}
          >
            {props.options?.map((data, key) => (
              <ToggleButton
                className="!p-1 !px-2"
                key={key}
                value={data.value}
                sx={{
                  fontSize: "13px",
                  color: props.value === data.value ? "white" : "inherit",
                  backgroundColor: props.value === data.value ? "#1C64F2" : "#1c64f24d",
                  "&:hover": {
                    backgroundColor: "#1c64f24d", 
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#1C64F2", 
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#1654C0", 
                    },
                  },
                }}
              >
                {data.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </FormControl>
      )}
      {/* {props.type === "transaction1Dropdown" && (
         <FormControl fullWidth>
         <InputLabel
           shrink={true}
           sx={{
             position: "relative",
             fontSize: "1rem",
           }}
         >
           <span className="text-xl">
             {props.title}{" "}
             {props.required ? <span className="text-red-700">*</span> : null}
           </span>
         </InputLabel>
   
         <ToggleButtonGroup
           value={selectedValue}
           exclusive
           onClick={handleClick}
           aria-label="custom toggle dropdown"
           sx={{
             display: "flex",
             borderRadius: "5px",
             height: "40px",
             width: "100%",
             backgroundColor: selectedValue ? "#1C64F2" : "transparent",
             color: selectedValue ? "white" : "inherit",
             "& .MuiToggleButtonGroup-grouped": {
               width: "100%",
               border: "none",
               justifyContent: "space-between",
             },
           }}
         >
           <ToggleButton
             value={selectedValue}
             sx={{
               fontSize: "13px",
               width: "100%",
               color: selectedValue ? "white" : "inherit",
               backgroundColor: selectedValue ? "#1C64F2" : "transparent",
               "&:hover": {
                 backgroundColor: selectedValue ? "#1654C0" : "#E0E0E0",
               },
             }}
           >
             {props.options.find((option) => option.value === selectedValue)?.label || "Select"}
           </ToggleButton>
         </ToggleButtonGroup>
   
         <Popover
           id={id}
           open={open}
           anchorEl={anchorEl}
           onClose={handleClose}
           anchorOrigin={{
             vertical: "bottom",
             horizontal: "left",
           }}
           transformOrigin={{
             vertical: "top",
             horizontal: "left",
           }}
         >
           <Box sx={{ display: "flex", flexDirection: "column" }}>
             {props.options.map((data, key) => (
               <ToggleButton
                 key={key}
                 value={data.value}
                 selected={selectedValue === data.value}
                 onClick={(event) => handleSelect(event, data.value)}
                 sx={{
                   fontSize: "13px",
                   color: selectedValue === data.value ? "white" : "inherit",
                   backgroundColor: selectedValue === data.value ? "#1C64F2" : "transparent",
                   "&:hover": {
                     backgroundColor: selectedValue === data.value ? "#1654C0" : "#E0E0E0",
                   },
                 }}
               >
                 {data.label}
               </ToggleButton>
             ))}
           </Box>
         </Popover>
       </FormControl>
     
   
      )} */}

      {props.type === "textField" && (
        <>
          <Input
            label={props.title}
            required={props.required === true || props.required === "true"}
            multiline={props.multiline === true || props.multiline === "true"}
            name={props.name}
            type={props.types}
            autoComplete={props.autoComplete}
            value={props.value}
            onChange={props.onChange}
            onClick={props.onClick}
            placeholder={props.placeholder}
            {...props}
          />
        </>
      )}
      {props.type === "fileUpload" && (
        <>
          <Input
            label={props.title}
            required={props.required === true || props.required === "true"}
            name={props.name}
            type="file"
            autoComplete={props.autoComplete}
            value={props.value}
            onChange={props.onChange}
            placeholder={props.placeholder}
            {...props}
          />
        </>
      )}

      {props.type === "dropdown" && (
        <>
          <FormControl fullWidth>
            <InputLabel id="service-select-label">
              <span className="text-sm relative bottom-[6px]">
                {props.title} <span className="text-red-700">*</span>
              </span>
            </InputLabel>
            <Select
              sx={{ height: "40px", borderRadius: "5px" }}
              labelId="service-select-label"
              id="service-select"
              name={props.name}
              value={props.value}
              label={props.title}
              onChange={props.onchange}
              {...props}
              required={props.required === true || props.required === "true"}
            >
              {props.options?.map((data, key) => (
                <MenuItem key={key} value={data.refer_by}>
                  {data.refer_by}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
      {props.type === "locationDropdown" && (
        <>
          <FormControl fullWidth>
            <InputLabel id="service-select-label">
              <span className="text-sm relative bottom-[6px]">
                {props.title} <span className="text-red-700">*</span>
              </span>
            </InputLabel>
            <Select
              sx={{ height: "40px", borderRadius: "5px" }}
              labelId="service-select-label"
              id="service-select"
              name={props.name}
              value={props.value}
              label={props.title}
              onChange={props.onchange}
              {...props}
              required={props.required === true || props.required === "true"}
            >
              {props.options?.map((data, key) => (
                <MenuItem key={key} value={data}>
                  {data}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
      {props.type === "serviceDropdown" && (
        <>
          <FormControl fullWidth>
            <InputLabel id="service-select-label">
              <span className="text-sm relative bottom-[6px]">
                {props.title} <span className="text-red-700">*</span>
              </span>
            </InputLabel>
            <Select
              sx={{ height: "40px", borderRadius: "5px" }}
              labelId="service-select-label"
              id="service-select"
              name={props.name}
              value={props.value}
              label={props.title}
              onChange={props.onchange}
              {...props}
              required={props.required === true || props.required === "true"}
            >
              {props.options?.map((data, key) => (
                <MenuItem key={key} value={data.id}>
                  {data.service}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
      {props.type === "multiSelectDropdown" && (
        <>
          <FormControl fullWidth>
            <InputLabel id="service-select-label">
              <span className="text-sm relative bottom-[6px]">
                {props.title} <span className="text-red-700">*</span>
              </span>
            </InputLabel>
            <Select
              sx={{ height: "40px", borderRadius: "5px" }}
              labelId="service-select-label"
              id="service-select"
              name={props.name}
              value={props.value} // Ensure this is an array for multi-select
              label={props.title}
              onChange={props.onchange}
              multiple // Enables multi-select
              renderValue={(selected) => selected.join(", ")} // Renders selected values
              {...props}
              required={props.required === true || props.required === "true"}
            >
              {props.options?.map((data, key) => (
                <MenuItem key={key} value={data.service}>
                  <Checkbox checked={props.value === data.service} />
                  <ListItemText primary={data.service} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
      {props.type === "branchDropdown" && (
        <>
          <FormControl fullWidth>
            <InputLabel id="service-select-label">
              <span className="text-sm relative bottom-[6px]">
                {props.title} <span className="text-red-700">*</span>
              </span>
            </InputLabel>
            <Select
              sx={{ height: "40px", borderRadius: "5px" }}
              labelId="service-select-label"
              id="service-select"
              name={props.name}
              value={props.value}
              label={props.title}
              onChange={props.onchange}
              {...props}
              required={props.required === true || props.required === "true"}
            >
              {props.options?.map((data, key) => (
                <MenuItem key={key} value={data.id}>
                  {data.branch_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
      {props.type === "whatsappDropdown" && (
        <>
          <FormControl fullWidth>
            <InputLabel id="service-select-label">
              <span className="text-sm relative bottom-[6px]">
                {props.title}{" "}
                {props.required ? (
                  <span className="text-red-700">*</span>
                ) : null}
              </span>
            </InputLabel>
            <Select
              sx={{ height: "40px", borderRadius: "5px" }}
              labelId="service-select-label"
              id="service-select"
              name={props.name}
              value={props.value}
              label={props.title}
              onChange={props.onchange}
              {...props}
              required={props.required === true || props.required === "true"}
            >
              {props.options?.map((data, key) => (
                <MenuItem key={key} value={data.value}>
                  {data.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
      {props.type === "sourceDropdown" && (
        <>
          <FormControl fullWidth>
            <InputLabel id="service-select-label">
              <span className="text-sm relative bottom-[6px]">
                {props.title}{" "}
                {props.required ? (
                  <span className="text-red-700">*</span>
                ) : null}
              </span>
            </InputLabel>
            <Select
              sx={{ height: "40px", borderRadius: "5px" }}
              labelId="service-select-label"
              id="service-select"
              name={props.name}
              value={props.value}
              label={props.title}
              onChange={props.onchange}
              {...props}
              required={props.required === true || props.required === "true"}
            >
              {props.options?.map((data, key) => (
                <MenuItem key={data.id} value={data.data_source_type}>
                  {data.data_source_type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
      {props.type === "stateDropdown" && (
        <>
          <FormControl fullWidth>
            <InputLabel id="service-select-label">
              <span className="text-sm relative bottom-[6px]">
                {props.title}{" "}
                {props.required ? (
                  <span className="text-red-700">*</span>
                ) : null}
              </span>
            </InputLabel>
            <Select
              sx={{ height: "40px", borderRadius: "5px" }}
              labelId="service-select-label"
              id="service-select"
              name={props.name}
              value={props.value}
              label={props.title}
              onChange={props.onchange}
              {...props}
              required={props.required === true || props.required === "true"}
            >
              {props.options?.map((data, key) => (
                <MenuItem key={data.id} value={data.state_name}>
                  {data.state_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
      {props.type === "gotraDropdown" && (
        <>
          <FormControl fullWidth>
            <InputLabel id="service-select-label">
              <span className="text-sm relative bottom-[6px]">
                {props.title}{" "}
                {props.required ? (
                  <span className="text-red-700">*</span>
                ) : null}
              </span>
            </InputLabel>
            <Select
              sx={{ height: "40px", borderRadius: "5px" }}
              labelId="service-select-label"
              id="service-select"
              name={props.name}
              value={props.value}
              label={props.title}
              onChange={props.onchange}
              {...props}
              required={props.required === true || props.required === "true"}
            >
              {props.options?.map((data, key) => (
                <MenuItem key={data.gotra_name} value={data.gotra_name}>
                  {data.gotra_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
      {props.type === "categoryDropdown" && (
        <>
          <FormControl fullWidth>
            <InputLabel id="service-select-label">
              <span className="text-sm relative bottom-[6px]">
                {props.title}{" "}
                {props.required ? (
                  <span className="text-red-700">*</span>
                ) : null}
              </span>
            </InputLabel>
            <Select
              sx={{ height: "40px", borderRadius: "5px" }}
              labelId="service-select-label"
              id="service-select"
              name={props.name}
              value={props.value}
              label={props.title}
              onChange={props.onchange}
              {...props}
              required={props.required === true || props.required === "true"}
            >
              {props.options?.map((data, key) => (
                <MenuItem key={key} value={data.id}>
                  {data.product_category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
      {props.type === "userDropdown" && (
        <>
          <FormControl fullWidth>
            <InputLabel id="service-select-label">
              <span className="text-sm relative bottom-[6px]">
                {props.title}{" "}
                {props.required ? (
                  <span className="text-red-700">*</span>
                ) : null}
              </span>
            </InputLabel>
            <Select
              sx={{ height: "40px", borderRadius: "5px" }}
              labelId="service-select-label"
              id="service-select"
              name={props.name}
              value={props.value}
              label={props.title}
              onChange={props.onchange}
              {...props}
              required={props.required === true || props.required === "true"}
            >
              {props.options?.map((data, key) => (
                <MenuItem key={data.id} value={data.id}>
                  {data.full_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
      {props.type === "productDropdown" && (
        <>
          <FormControl fullWidth>
            <InputLabel id="service-select-label">
              <span className="text-sm relative bottom-[6px]">
                {props.title}{" "}
                {props.required ? (
                  <span className="text-red-700">*</span>
                ) : null}
              </span>
            </InputLabel>
            <Select
              sx={{ height: "40px", borderRadius: "5px" }}
              labelId="service-select-label"
              id="service-select"
              name={props.name}
              value={props.value}
              label={props.title}
              onChange={props.onchange}
              {...props}
              required={props.required === true || props.required === "true"}
            >
              {props.options?.map((data, key) => (
                <MenuItem key={data.id} value={data.id}>
                  {data.product_category}
                  {"-"}
                  {data.product_sub_category}
                  {"-"}
                  {data.products_brand}
                  {"-"}
                  {data.products_thickness}
                  {"-"}
                  {data.products_unit}
                  {"-"}
                  {data.products_size1}
                  {"x"}
                  {data.products_size2}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
      {props.type === "subCategoryDropdown" && (
        <>
          <FormControl fullWidth>
            <InputLabel id="service-select-label">
              <span className="text-sm relative bottom-[6px]">
                {props.title}{" "}
                {props.required ? (
                  <span className="text-red-700">*</span>
                ) : null}
              </span>
            </InputLabel>
            <Select
              sx={{ height: "40px", borderRadius: "5px" }}
              labelId="service-select-label"
              id="service-select"
              name={props.name}
              value={props.value}
              label={props.title}
              onChange={props.onchange}
              {...props}
              required={props.required === true || props.required === "true"}
            >
              {props.options?.map((data, key) => (
                <MenuItem key={data.id} value={data.id}>
                  {data.product_sub_category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
      {props.type === "brandDropdown" && (
        <>
          <FormControl fullWidth>
            <InputLabel id="service-select-label">
              <span className="text-sm relative bottom-[6px]">
                {props.title}{" "}
                {props.required ? (
                  <span className="text-red-700">*</span>
                ) : null}
              </span>
            </InputLabel>
            <Select
              sx={{ height: "40px", borderRadius: "5px" }}
              labelId="service-select-label"
              id="service-select"
              name={props.name}
              value={props.value}
              label={props.title}
              onChange={props.onchange}
              {...props}
              required={props.required === true || props.required === "true"}
            >
              {props.options?.map((data, key) => (
                <MenuItem key={data.brands_name} value={data.brands_name}>
                  {data.brands_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
      {props.type === "subServiceDropdown" && (
        <>
          <FormControl fullWidth>
            <InputLabel id="service-select-label">
              <span className="text-sm relative bottom-[6px]">
                {props.title} <span className="text-red-700">*</span>
              </span>
            </InputLabel>
            <Select
              sx={{ height: "40px", borderRadius: "5px" }}
              labelId="service-select-label"
              id="service-select"
              name={props.name}
              value={props.value}
              label={props.title}
              onChange={props.onchange}
              {...props}
              required={props.required === true || props.required === "true"}
            >
              {props.options?.map((data, key) => (
                <MenuItem key={key} value={data.id}>
                  {data.service_sub}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
      {props.type === "priceforDropdown" && (
        <>
          <FormControl fullWidth>
            <InputLabel id="service-select-label">
              <span className="text-sm relative bottom-[6px]">
                {props.title} <span className="text-red-700">*</span>
              </span>
            </InputLabel>
            <Select
              sx={{ height: "40px", borderRadius: "5px" }}
              labelId="service-select-label"
              id="service-select"
              name={props.name}
              value={props.value}
              label={props.title}
              onChange={props.onchange}
              {...props}
              required={props.required === true || props.required === "true"}
            >
              {props.options?.map((data, key) => (
                <MenuItem key={key} value={data.country_name}>
                  {data.country_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
      {props.type === "countryDropdown" && (
        <>
          <FormControl fullWidth>
            <InputLabel id="service-select-label">
              <span className="text-sm relative bottom-[6px]">
                {props.title} <span className="text-red-700">*</span>
              </span>
            </InputLabel>
            <Select
              sx={{ height: "40px", borderRadius: "5px" }}
              labelId="service-select-label"
              id="service-select"
              name={props.name}
              value={props.value}
              label={props.title}
              onChange={props.onchange}
              {...props}
              required={props.required === true || props.required === "true"}
            >
              {props.options?.map((data, key) => (
                <MenuItem key={key} value={data.id}>
                  {data.service_price_for} - {data.service_price_rate}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
      {props.type === "courseDropdown" && (
        <>
          <FormControl fullWidth>
            <InputLabel id="service-select-label">
              <span className="text-sm relative bottom-[6px]">
                {props.title} <span className="text-red-700">*</span>
              </span>
            </InputLabel>
            <Select
              sx={{ height: "40px", borderRadius: "5px" }}
              labelId="service-select-label"
              id="service-select"
              name={props.name}
              value={props.value}
              label={props.title}
              onChange={props.onchange}
              {...props}
              required={props.required === true || props.required === "true"}
            >
              {props.options?.map((data, key) => (
                <MenuItem key={key} value={data.courses_name}>
                  {data.courses_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
      {props.type === "studentDropdown" && (
        <>
          <FormControl fullWidth>
            <InputLabel id="service-select-label">
              <span className="text-sm relative bottom-[6px]">
                {props.title} <span className="text-red-700">*</span>
              </span>
            </InputLabel>
            <Select
              sx={{ height: "40px", borderRadius: "5px" }}
              labelId="service-select-label"
              id="service-select"
              name={props.name}
              value={props.value}
              label={props.title}
              onChange={props.onchange}
              {...props}
              required={props.required === true || props.required === "true"}
            >
              {props.options?.map((data, key) => (
                <MenuItem key={key} value={data.user_uid}>
                  {data.user_uid + " - " + data.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
      {props.type === "requestDropdown" && (
        <>
          <FormControl fullWidth>
            <InputLabel id="service-select-label">
              <span className="text-sm relative bottom-[6px]">
                {props.title} <span className="text-red-700">*</span>
              </span>
            </InputLabel>
            <Select
              sx={{ height: "40px", borderRadius: "5px" }}
              labelId="service-select-label"
              id="service-select"
              name={props.name}
              value={props.value}
              label={props.title}
              onChange={props.onchange}
              {...props}
              required={props.required === true || props.required === "true"}
            >
              {props.options?.map((data, key) => (
                <MenuItem key={key} value={data.user_request_type}>
                  {data.user_request_type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
      {props.type === "employeeDropdown" && (
        <>
          <FormControl fullWidth>
            <InputLabel id="service-select-label">
              <span className="text-sm relative bottom-[6px]">
                {props.title} <span className="text-red-700">*</span>
              </span>
            </InputLabel>
            <Select
              sx={{ height: "40px", borderRadius: "5px" }}
              labelId="service-select-label"
              id="service-select"
              name={props.name}
              value={props.value}
              label={props.title}
              onChange={props.onchange}
              {...props}
              required={props.required === true || props.required === "true"}
              disabled={props.disabled === true || props.disabled === "true"}
            >
              {props.options?.map((data, key) => (
                <MenuItem key={key} value={data.id}>
                  {data.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
    </>
  );
};

export default Fields;
