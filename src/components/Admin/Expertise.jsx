import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
} from "@mui/material";
import {
  addExpertise,
  expertise,
  editExpertise,
} from "../../services/admin/apiMethods";
import toast from "react-hot-toast";

const blueColor = "#2172d2";
const tealColor = "#17d5d1";

function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState("");

  const fetchData = async () => {
    const response = await expertise();
    if (response.status === 200) {
      setCategories(response.data.data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveCategory = async (id) => {
    try {
      const name = editingCategory.name.toUpperCase();
      const response = await editExpertise({ id, name });

      if (response.status === 200) {
        setCategories(categories.map((category) =>
          category._id === id ? { ...category, name: name } : category
        ));
        setEditingCategory(null);
      } else {
        toast.error("Something Went Wrong");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const addCategory = async () => {
    const response = await addExpertise({ name: newCategory.toUpperCase() });
    if (response.status === 200) {
      setCategories([...categories, { _id: response.data._id, name: newCategory.toUpperCase() }]);
      setNewCategory("");
    } else {
      toast.error("Something Went Wrong");
    }
  };

  //   if (isLoading) {
  //     return <h1 className="text-center text-2xl mt-10">Fetching categories...</h1>;
  //   }

  return (
    <div className="m-4">
      <h1
        className="text-3xl font-bold mb-4"
        style={{ color: blueColor, textAlign: "center" }}
      >
        SPECIALIZATIONS
      </h1>

      <TableContainer component={Paper}>
        <Table aria-label="categories table">
          <TableHead>
            <TableRow style={{ backgroundColor: blueColor, color: "#fff" }}>
              <TableCell>Specialization</TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow
                key={category._id}
                style={{
                  backgroundColor: "#fff",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                <TableCell>
                  {editingCategory && editingCategory._id === category._id ? (
                    <TextField
                      value={editingCategory.name}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          name: e.target.value,
                        })
                      }
                    />
                  ) : (
                    category.name
                  )}
                </TableCell>
                <TableCell>
                  {editingCategory && editingCategory._id === category._id ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => saveCategory(category._id)}
                      style={{ backgroundColor: tealColor, color: "#fff" }}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => setEditingCategory(category)}
                    >
                      Edit
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="mt-4 flex justify-center">
        <TextField
          label="New Category"
          variant="outlined"
          size="small"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={addCategory}
          style={{ backgroundColor: blueColor, color: "#fff" }}
        >
          Add
        </Button>
      </div>
    </div>
  );
}

export default CategoriesList;
