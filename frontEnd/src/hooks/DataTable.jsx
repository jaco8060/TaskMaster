import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  InputGroup,
  Pagination,
  Row,
  Table,
} from "react-bootstrap";

const DataTable = ({ endpoint, columns, searchFields }) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(endpoint);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [endpoint]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (event) => {
    const value = Number(event.target.value);
    if (!isNaN(value) && value > 0) {
      setItemsPerPage(value);
      setCurrentPage(1);
    }
  };

  const filteredData = data.filter((item) =>
    searchFields.some((field) =>
      item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Row className="mb-3">
        <Col xs={12} md={6} className="d-flex justify-content-start">
          <Form.Group
            controlId="itemsPerPageSelect"
            className="d-flex align-items-center mb-0"
          >
            <Form.Label className="mb-0 mr-2">Show</Form.Label>
            <Form.Control
              type="number"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="ml-2"
              style={{ width: "80px", marginLeft: "10px" }} // Added marginLeft for spacing
              min="1"
            />
            <span className="ml-2" style={{ marginLeft: "10px" }}>
              entries
            </span>{" "}
            {/* Added marginLeft for spacing */}
          </Form.Group>
        </Col>
        <Col
          xs={12}
          md={6}
          className="d-flex align-items-center justify-content-end"
        >
          <InputGroup>
            <Form.Control
              placeholder={`Search by ${searchFields.join(", ")}`}
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Button
              variant="outline-secondary"
              onClick={() => setSearchTerm("")}
            >
              Clear
            </Button>
          </InputGroup>
        </Col>
      </Row>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th key={index}>{column.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex}>{item[column.accessor]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination>
            {[...Array(totalPages).keys()].map((page) => (
              <Pagination.Item
                key={page + 1}
                active={page + 1 === currentPage}
                onClick={() => handlePageChange(page + 1)}
              >
                {page + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      )}
    </div>
  );
};

export default DataTable;
