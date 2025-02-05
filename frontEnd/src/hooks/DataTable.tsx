import axios from "axios";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  InputGroup,
  Pagination,
  Row,
  Spinner,
} from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { FaSearch, FaTimes } from "react-icons/fa"; // Import icons
import {
  MdExpandLess, // For ascending (▲)
  MdExpandMore, // For descending (▼)
  MdUnfoldMore,
} from "react-icons/md";
import "../styles/hooks/DataTable.scss"; // Import the CSS file

// Define types for the component props and state
interface Column {
  header: string;
  accessor: string;
  sortable?: boolean;
  type?: "date" | "string" | "number";
}

interface DataTableProps {
  endpoint?: string;
  columns: Column[];
  searchFields: string[];
  refresh?: boolean;
  renderCell?: (item: any, accessor: string) => React.ReactNode;
  staticData?: any[];
}

const DataTable: React.FC<DataTableProps> = ({
  endpoint,
  columns,
  searchFields,
  refresh,
  renderCell,
  staticData,
}) => {
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: string | null;
  }>({
    key: null,
    direction: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (staticData) {
        setData(staticData);
        setLoading(false);
        return;
      }
      if (endpoint) {
        setLoading(true);
        try {
          const response = await axios.get(endpoint, { withCredentials: true });
          setData(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, refresh, staticData]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(event.target.value);
    if (!isNaN(value) && value > 0) {
      setItemsPerPage(value);
      setCurrentPage(1);
    }
  };

  const handleSort = (key: string) => {
    let direction = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (sortConfig.key) {
      return [...data].sort((a, b) => {
        const column = columns.find((col) => col.accessor === sortConfig.key);

        if (column?.type === "date") {
          const dateA = new Date(a[sortConfig.key!]);
          const dateB = new Date(b[sortConfig.key!]);
          // Invert: when direction is 'asc', sort descending (largest dates first)
          return sortConfig.direction === "asc"
            ? dateB.getTime() - dateA.getTime()
            : dateA.getTime() - dateB.getTime();
        }

        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        return 0;
      });
    }
    return data;
  }, [data, sortConfig, columns]);

  const filteredData = sortedData.filter((item) =>
    searchFields.some((field) =>
      item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const startEntry = indexOfFirstItem + 1;
  const endEntry = Math.min(indexOfLastItem, filteredData.length);

  return (
    <div className="data-table-container">
      <Row className="mb-3 align-items-center">
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
              className="ml-2 items-per-page-input"
              min="1"
            />
            <span className="ml-2">entries</span>
          </Form.Group>
        </Col>
        <Col xs={12} md={6} className="d-flex justify-content-end">
          <InputGroup className="search-input-group">
            <InputGroup.Text id="search-icon">
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              aria-label="Search"
              aria-describedby="search-icon"
            />
            {searchTerm && (
              <Button
                variant="outline-secondary"
                className="clear-button"
                onClick={() => setSearchTerm("")}
              >
                <FaTimes />
              </Button>
            )}
          </InputGroup>
        </Col>
      </Row>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <Table responsive className="table-hover">
            <thead>
              <tr className="table-dark table-active text-uppercase text-white text-nowrap">
                {columns.map((column, index) => (
                  <th key={index} className="header-cell">
                    <div className="header-content">
                      <span className="header-text">{column.header}</span>
                      {column.sortable !== false && ( // Only show sort button if sortable is not false
                        <Button
                          variant="link"
                          onClick={() => handleSort(column.accessor)}
                          className="sort-button"
                          title={`Sort by ${column.header}`}
                        >
                          {sortConfig.key === column.accessor ? (
                            sortConfig.direction === "asc" ? (
                              <MdExpandLess className="sort-icon" />
                            ) : (
                              <MdExpandMore className="sort-icon" />
                            )
                          ) : (
                            <MdUnfoldMore className="sort-icon" />
                          )}
                        </Button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index}>
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={
                        column.accessor === "description" || "comment"
                          ? "wrapped-cell description-column"
                          : "wrapped-cell"
                      }
                    >
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
