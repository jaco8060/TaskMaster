import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  InputGroup,
  Pagination,
  Row,
  Spinner,
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
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

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

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (sortConfig.key) {
      return [...data].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return data;
  }, [data, sortConfig]);

  const filteredData = sortedData.filter((item) =>
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
        <div className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <Table responsive className="custom-table">
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th key={index} className="header-cell">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>{column.header}</span>
                      <Button
                        variant="link"
                        onClick={() => handleSort(column.accessor)}
                        className="sort-button"
                      >
                        {sortConfig.key === column.accessor ? (
                          sortConfig.direction === "asc" ? (
                            <span style={{ fontSize: "0.75rem" }}>▲</span>
                          ) : (
                            <span style={{ fontSize: "0.75rem" }}>▼</span>
                          )
                        ) : (
                          <span style={{ fontSize: "0.75rem" }}>↕</span>
                        )}
                      </Button>
                    </div>
                  </th>
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
