import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Stack,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DescriptionIcon from "@mui/icons-material/Description";
import CalculateIcon from "@mui/icons-material/Calculate";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PersonIcon from "@mui/icons-material/Person";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import React, { useEffect, useState } from "react";
import { fetchQuotations } from "../api/quotations"; // adjust path as needed

// other imports remain the same...

function Quotations() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [quotationsData, setQuotationsData] = useState([]);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  useEffect(() => {
    const loadQuotations = async () => {
      try {
        const data = await fetchQuotations(); // ✅ fixed
        setQuotationsData(data);
      } catch (err) {
        console.error("Failed to load quotations:", err);
      }
    };

    loadQuotations();
  }, []);

  const validData = quotationsData.filter((row) => Object.keys(row).length > 0);

  return (
    <Box display="flex" flexDirection="column" width="100%">
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
        mb={2}
      >
        <Typography variant="h5" fontWeight="bold">
          Quotation List
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="text"
          color="inherit"
          sx={{ textTransform: "capitalize" }}
        >
          Create New
        </Button>
      </Box>

      {/* Scrollable Table */}
      <Box sx={{ maxHeight: 800, overflowY: "auto", borderRadius: 2 }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              {["Date", "Quotation ID", "Customer", "Agents", "Status", ""].map(
                (label, index) => (
                  <TableCell
                    key={index}
                    sx={{
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#111",
                      color: "#fff",
                      zIndex: 1,
                      fontWeight: 600,
                    }}
                    align={label === "" ? "right" : "left"}
                  >
                    {label}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {validData.length > 0 ? (
              validData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.created_at?.split("T")[0]}</TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.customer_name || "-"}</TableCell>
                  <TableCell>{row.agents || "-"}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      sx={{
                        backgroundColor: "#f7c100",
                        color: "#000",
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={handleMenuClick}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      PaperProps={{
                        elevation: 3,
                        sx: {
                          borderRadius: 2,
                          minWidth: 200,
                          mt: 1,
                        },
                      }}
                    >
                      {[
                        {
                          icon: <DescriptionIcon fontSize="small" />,
                          label: "Quotations",
                        },
                        {
                          icon: <CalculateIcon fontSize="small" />,
                          label: "Margin Control",
                        },
                        {
                          icon: <CreditCardIcon fontSize="small" />,
                          label: "Payment Terms",
                        },
                        {
                          icon: <PersonIcon fontSize="small" />,
                          label: "Customer",
                        },
                        {
                          icon: <PauseCircleIcon fontSize="small" />,
                          label: "Hold Project",
                        },
                        {
                          icon: <DeleteIcon fontSize="small" />,
                          label: "Delete",
                        },
                      ].map((item, i) => (
                        <MenuItem key={i} onClick={handleClose}>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            {item.icon}
                            <Typography>{item.label}</Typography>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Menu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  sx={{ height: 600, backgroundColor: "#f5f5f5" }}
                >
                  <Typography variant="body2" color="textSecondary">
                    No quotations available
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}

export default Quotations;
