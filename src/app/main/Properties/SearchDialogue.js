import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import { SearchResults } from "./PropertySlice1";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import statesData from "./statesData.json";
import PriceDetails from "./PriceDetails.json";

const SearchDialogue = ({ onSearch }) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [responseData, setresponseData] = useState("");
  const [formData, setFormData] = useState({
    p_type: "",
    listing_type: "",
    price_range: "",
    state: "",
    district: "",
    approved_by: "",
    status: "",
    landmark: "",
    loan_eligible: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  // const isLoading = useSelector((state) => state.property.status === 'loading');
  const [data, setData] = useState(null);
  const [noDataFound, setNoDataFound] = useState(false);
  const [districtOptions, setDistrictOptions] = useState([]);
  // const error = useSelector((state) => state.property.error);
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const { name, value } = event.target;

    console.log(`Changing ${name} to ${value}`);

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    if (name === "state") {
      const selectedState = statesData.states.find(
        (state) => state.name === value
      );
      setDistrictOptions(selectedState ? selectedState.district : []);
      // Reset district when state changes
      setFormData((prevFormData) => ({
        ...prevFormData,
        district: "",
      }));
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const priceRangeString = formData.price_range;
      // console.log(priceRangeString);
  
      const [minString, maxString] = priceRangeString.split("-");
      const min = parseInt(minString, 10);
      const max = parseInt(maxString, 10);
  
      const payload = {
        ...formData,
        price_range: {
          min: min,
          max: max,
        },
      };
  
      console.log("Payload:", JSON.stringify(payload, null, 2));
  
      const result = await dispatch(SearchResults(payload)).unwrap();
      // console.log("Search Result:", result);
  
      if (!result || !result.data || result.data.property.length === 0) {
        // console.log("No properties found");
        setNoDataFound(true);
        onSearch(null);
      } else {
        setNoDataFound(false);
        onSearch(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error.message);
      setNoDataFound(true);
      onSearch(null);
    } finally {
      setIsLoading(false);
      handleClose();
    }
  };
  

  const handleSearch = () => {
    console.log("Search query:", searchQuery);
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          alignItems: "end",
          padding: "2px 10px",
          marginBottom: "30px",
        }}
      >
        <TextField
          variant="outlined"
          size="medium"
          placeholder="Search ..."
          onClick={handleClickOpen}
          // value={searchQuery}
          // onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ marginRight: "120px", width: "600px", fontSize: "45px" }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{
            padding: "5px 20px",
            backgroundColor: "#4caf50",
            "&:hover": { backgroundColor: "#45a049" },
          }}
        >
          Search
        </Button>
      </Box>

      <Dialog
        fullWidth={formData.fullWidth}
        maxWidth={formData.maxWidth}
        open={open}
        onClose={handleClose}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <DialogTitle>Choose Your Requirements</DialogTitle>
          <CloseIcon
            sx={{ cursor: "pointer", margin: "10px" }}
            onClick={handleClose}
          />
        </div>
        <DialogContent>
          <Box>
            <FormControl fullWidth>
              <InputLabel id="property-type-label">Property Types</InputLabel>
              <Select
                labelId="property-type-label"
                id="property-type-select"
                name="p_type"
                value={formData.p_type}
                label="Property select"
                onChange={handleChange}
              >
                <MenuItem value=" ">Any</MenuItem>
                <MenuItem value="plot">Plots</MenuItem>
                <MenuItem value="flat">Flats</MenuItem>
                <MenuItem value="land">Lands</MenuItem>
                <MenuItem value="WareHouses">WareHouses</MenuItem>
                <MenuItem value="PG">PG</MenuItem>
                <MenuItem value="OfficePlace">OfficePlace</MenuItem>
                <MenuItem value="CoWorkingPlace">CoWorkingPlace</MenuItem>
                <MenuItem value="StudentHostels">StudentHostels</MenuItem>
                <MenuItem value="AgriculturalLands">AgriculturalLands</MenuItem>
                <MenuItem value="Apartment">Apartment</MenuItem>
                <MenuItem value="IndependentHouse">IndependentHouse</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ marginTop: "10px" }}>
            <FormControl sx={{ mt: 2, minWidth: "200px", margin: "4px 5px" }}>
              <InputLabel>Listing Type</InputLabel>
              <Select
                name="listing_type"
                value={formData.listing_type}
                onChange={handleChange}
                label="Listing Type"
              >
                <MenuItem value=" ">Any</MenuItem>
                <MenuItem value="sell">Sell</MenuItem>
                <MenuItem value="buy">Buy</MenuItem>
                <MenuItem value="rent">Rent</MenuItem>
                <MenuItem value="UnderConstruction">
                  Under Construction
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ mt: 2, minWidth: "180px", margin: "4px 5px" }}>
              <InputLabel id="budget-label">Budget ₹</InputLabel>
              <Select
                labelId="price_range"
                id="budget"
                name="price_range"
                value={formData.price_range}
                onChange={handleChange}
                label="Budget ₹"
              >
                {Object.keys(PriceDetails.PriceDetails).map((key) => (
                  <MenuItem key={key} value={key}>
                    {key === "Any"
                      ? "Any"
                      : `₹${PriceDetails.PriceDetails[
                          key
                        ].min.toLocaleString()} - ₹${PriceDetails.PriceDetails[
                          key
                        ].max.toLocaleString()}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: "140px", mt: 2, margin: "4px 5px" }}>
              <InputLabel>Select State</InputLabel>
              <Select
                name="state"
                value={formData.state}
                onChange={handleChange}
                label="Select State"
              >
                {statesData.states.map((state) => (
                  <MenuItem key={state.id} value={state.name}>
                    {state.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <FormControl sx={{ mt: 2, minWidth: "130px", margin: "6px 5px" }}>
            <InputLabel>District</InputLabel>
            <Select
              name="district"
              value={formData.district}
              onChange={handleChange}
              label="Select District"
            >
              {districtOptions.map((district) => (
                <MenuItem key={district} value={district}>
                  {district}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ mt: 2, minWidth: "130px", margin: "6px 5px" }}>
            <InputLabel>Landmark</InputLabel>
            <Select
              name="Landmark"
              value={formData.landmark}
              onChange={handleChange}
              label="Select Landmark"
            >
              
              <MenuItem value=" ">Any</MenuItem>
              <MenuItem value="Panchayat">palasa</MenuItem>
              <MenuItem value="Vuda">Beside National highway</MenuItem>
              <MenuItem value="Rera">gajuwaka</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ mt: 2, minWidth: "130px", margin: "6px 5px" }}>
            <InputLabel>Approved</InputLabel>
            <Select
              name="approved_by"
              value={formData.approved_by}
              onChange={handleChange}
              label="Select Approved"
            >
              <MenuItem value=" ">Any</MenuItem>
              <MenuItem value="Panchayat">Panchayat</MenuItem>
              <MenuItem value="Vuda">Vuda</MenuItem>
              <MenuItem value="Rera">Rera</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ mt: 2, minWidth: "140px", margin: "6px 5px" }}>
            <InputLabel>Loan Eligibility</InputLabel>
            <Select
              name="Loan Eligibility"
              value={formData.loan_eligible}
              onChange={handleChange}
              label="Select Loan Eligibility"
            >
              <MenuItem value=" ">Any</MenuItem>
              <MenuItem value="true">Yes</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Box
            sx={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            {isLoading ? (
              <CircularProgress />
            ) : (
              <Button
                onClick={handleSubmit}
                style={{ backgroundColor: "#1D2432", color: "white" }}
              >
                Submit
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </React.Fragment>
  );
};

export default SearchDialogue;
