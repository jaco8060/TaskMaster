import axios from "axios";
import {
  differenceInDays,
  format,
  isToday,
  isYesterday,
  parseISO,
} from "date-fns";
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
import "../styles/hooks/DataTable.scss"; // Import the CSS file

const DataTable = ({
  endpoint,
  columns,
  searchFields,
  refresh,
  renderCell,
}) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(endpoint, { withCredentials: true });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [endpoint, refresh]); // Add refresh as a dependency

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

  const startEntry = indexOfFirstItem + 1;
  const endEntry = Math.min(indexOfLastItem, filteredData.length);

  return (
    <div>
      <Row className="mb-3">
        <Col xs={12} md={6} className="d-flex justify-content-start">
          <Form.Group
            controlId="itemsPerPageSelect"
            className="d-flex align-items-center mb-md-0 mb-3"
          >
            <Form.Label className="mb-0 mr-2">Show</Form.Label>
            <Form.Control
              type="number"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="ml-2"
              style={{ width: "80px", marginLeft: "10px" }}
              min="1"
            />
            <span className="ml-2" style={{ marginLeft: "10px" }}>
              entries
            </span>
          </Form.Group>
        </Col>
        <Col
          xs={12}
          md={6}
          className="d-flex align-items-center justify-content-end"
        >
          <InputGroup>
            <Form.Control
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Button
              variant="secondary"
              className="text-primary-subtle"
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
          <Table responsive className="custom-table">
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
                    <td key={colIndex} className="wrapped-cell">
                      {renderCell
                        ? renderCell(item, column.accessor)
                        : item[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              Showing {startEntry} to {endEntry} of {filteredData.length}{" "}
              entries
            </div>
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
          </div>
        </>
      )}
    </div>
  );
};

export default DataTable;
