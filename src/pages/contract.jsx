import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  API_GET_CONTRACT_TYPE,
  API_POST_CONTRACT_TYPE,
  API_UPDATE_CONTRACT_TYPE,
  API_DELETE_CONTRACT_TYPE,
  API_UPDATE_CONTRACT_TYPE_POSITIONS,
} from "../apiConfig";
import {
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

const ItemType = {
  ROW: "row",
};

// Draggable Row Component
const DraggableRow = ({
  contract,
  index,
  moveRow,
  handleEdit,
  handleDelete,
  handleRowClick,
  isEditMode,
}) => {
  const [, ref] = useDrag({
    type: ItemType.ROW,
    item: { index },
    canDrag: isEditMode, // <-- Only draggable when in edit mode
  });

  const [, drop] = useDrop({
    accept: ItemType.ROW,
    hover: (draggedItem) => {
      if (draggedItem.index !== index && isEditMode) {
        moveRow(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <TableRow ref={(node) => ref(drop(node))} hover>
      {/* Drag handle can be disabled too */}
      <TableCell>{isEditMode ? <DragIndicatorIcon /> : null}</TableCell>
      <TableCell
        onClick={() => handleRowClick(contract)}
        style={{ cursor: "pointer" }}
      >
        {contract.position}
      </TableCell>
      <TableCell
        onClick={() => handleRowClick(contract)}
        style={{ cursor: "pointer" }}
      >
        {contract.name}
      </TableCell>
      <TableCell
        onClick={() => handleRowClick(contract)}
        style={{ cursor: "pointer" }}
      >
        {contract.notes}
      </TableCell>
      <TableCell align="right">
        <IconButton
          aria-label="edit"
          onClick={() => handleEdit(contract)}
          disabled={isEditMode}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          aria-label="delete"
          onClick={() => handleDelete(contract)}
          disabled={isEditMode}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

const Contract = () => {
  const [contractTypes, setContractTypes] = useState([]);
  const [newContract, setNewContract] = useState({ name: "", notes: "" });
  const [editContract, setEditContract] = useState({
    id: "",
    name: "",
    notes: "",
  });
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [originalOrder, setOriginalOrder] = useState([]);

  // Inside Contract Component
  const navigate = useNavigate();

  const handleEnterEditMode = () => {
    setOriginalOrder([...contractTypes]); // Save original order
    setIsEditMode(true);
  };

  const handleSaveOrder = async () => {
    const updates = contractTypes.map((contract, index) => ({
      id: contract.id,
      newPosition: index + 1,
    }));

    try {
      await axios.put(API_UPDATE_CONTRACT_TYPE_POSITIONS, { updates });
      console.log("Positions updated successfully");
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating contract type positions:", error);
    }
  };

  const handleCancelEditMode = () => {
    setContractTypes(originalOrder); // Revert to original order
    setIsEditMode(false);
  };

  const handleRowClick = (contract) => {
    navigate(`/main/contract/${contract.id}`);
  };

  useEffect(() => {
    const fetchContractTypes = async () => {
      try {
        const response = await axios.get(API_GET_CONTRACT_TYPE);
        const sortedData = response.data.sort(
          (a, b) => a.position - b.position
        );
        setContractTypes(sortedData);
      } catch (error) {
        console.error("Error fetching contract types:", error);
      }
    };

    fetchContractTypes();
  }, []);

  const handleAddNew = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setNewContract({ name: "", notes: "" });
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(API_POST_CONTRACT_TYPE, newContract);
      setContractTypes([...contractTypes, response.data]);
      handleClose();
    } catch (error) {
      console.error("Error saving contract type:", error);
    }
  };

  const handleEdit = (contract) => {
    setEditContract(contract);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditContract({ id: "", name: "", notes: "" });
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${API_UPDATE_CONTRACT_TYPE}/${editContract.id}`,
        {
          name: editContract.name,
          notes: editContract.notes,
        }
      );
      setContractTypes(
        contractTypes.map((contract) =>
          contract.id === editContract.id ? response.data : contract
        )
      );
      handleEditClose();
    } catch (error) {
      console.error("Error updating contract type:", error);
    }
  };

  const handleDelete = (contract) => {
    setDeleteTarget(contract);
    setConfirmOpen(true);
  };

  // Function to refresh the contract types data
  const refreshContractTypes = async () => {
    try {
      const response = await axios.get(API_GET_CONTRACT_TYPE);
      const sortedData = response.data.sort((a, b) => a.position - b.position);
      setContractTypes(sortedData);
    } catch (error) {
      console.error("Error refreshing contract types:", error);
    }
  };

  // Confirm deletion
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${API_DELETE_CONTRACT_TYPE}/${deleteTarget.id}`);
      await refreshContractTypes(); // Refresh the component data
      setConfirmOpen(false);
      setDeleteTarget(null);
    } catch (error) {
      console.error("Error deleting contract type:", error);
    }
  };

  // Cancel deletion
  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setDeleteTarget(null);
  };

  const moveRow = useCallback(
    (fromIndex, toIndex) => {
      const updatedContractTypes = [...contractTypes];

      // Move the row by swapping positions
      const [movedRow] = updatedContractTypes.splice(fromIndex, 1);
      updatedContractTypes.splice(toIndex, 0, movedRow);

      // Recalculate positions based on new order
      const updates = updatedContractTypes.map((contract, index) => ({
        id: contract.id,
        newPosition: index + 1, // Ensure positions start at 1 and increment
      }));

      // Update the frontend state with new positions
      const updatedContractTypesWithPositions = updatedContractTypes.map(
        (contract, index) => ({
          ...contract,
          position: index + 1,
        })
      );

      setContractTypes(updatedContractTypesWithPositions);

      // Send the updated positions to the backend
      axios
        .put(API_UPDATE_CONTRACT_TYPE_POSITIONS, { updates })
        .then(() => {
          console.log("Positions updated successfully");
        })
        .catch((error) => {
          console.error("Error updating contract type positions:", error);
        });
    },
    [contractTypes]
  );

  const renderTableBody = () => {
    if (contractTypes.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} align="center">
            <div className="noData">
              <p>No data available</p>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return contractTypes.map((contract, index) => (
      <DraggableRow
        key={contract.id}
        index={index}
        contract={contract}
        moveRow={isEditMode ? moveRow : () => {}} // Only allow dragging if in edit mode
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleRowClick={handleRowClick}
        isEditMode={isEditMode}
      />
    ));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ flex: 1, display: "flex", maxWidth: "99%" }}>
        <div className="table">
          <div
            className="topTable"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2>All Contracts</h2>
            <div style={{ display: "flex", gap: "8px" }}>
              {!isEditMode && (
                <Button
                  variant="text"
                  color="success"
                  startIcon={<AddIcon />}
                  onClick={handleAddNew}
                  className="tableBtn"
                >
                  Add New
                </Button>
              )}
              {!isEditMode ? (
                <Button
                  variant="text"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={handleEnterEditMode}
                  className="tableBtn"
                >
                  Edit Order
                </Button>
              ) : (
                <>
                  <Button
                    variant="text"
                    color="primary"
                    startIcon={<CheckIcon />} // <-- Save Icon
                    onClick={handleSaveOrder}
                    className="tableBtn"
                  >
                    Save Order
                  </Button>
                  <Button
                    variant="text"
                    color="secondary"
                    startIcon={<ClearIcon />} // <-- Cancel Icon
                    onClick={handleCancelEditMode}
                    className="tableBtn"
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>

          <TableContainer component={Paper} className="tableContainer">
            <Table className="tableCap">
              <TableHead>
                <TableRow
                  backgroundColor={"var(--color-black)"}
                  color={"var(--color-white)"}
                >
                  <TableCell width={"2%"}></TableCell>
                  <TableCell width={"4%"}>No</TableCell>
                  <TableCell flex={"1"}>Name</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{renderTableBody()}</TableBody>
            </Table>
          </TableContainer>
        </div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add New Contract</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
              value={newContract.name}
              onChange={(e) =>
                setNewContract({ ...newContract, name: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Notes"
              fullWidth
              value={newContract.notes}
              onChange={(e) =>
                setNewContract({ ...newContract, notes: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={editOpen} onClose={handleEditClose}>
          <DialogTitle>Edit Contract</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
              value={editContract.name}
              onChange={(e) =>
                setEditContract({ ...editContract, name: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Notes"
              fullWidth
              value={editContract.notes}
              onChange={(e) =>
                setEditContract({ ...editContract, notes: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose} sx={{ color: "red" }}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} sx={{ color: "red" }}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={confirmOpen} onClose={handleCancelDelete}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            Are you sure you want to delete the contract "{deleteTarget?.name}"?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete} sx={{ color: "red" }}>
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} sx={{ color: "red" }}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </DndProvider>
  );
};

export default Contract;
