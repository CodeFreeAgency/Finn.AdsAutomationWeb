import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Row, Col, Button, Form } from "react-bootstrap";
import "./index.css";

const DashboardNew = () => {
  const [searchText, setSearchText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchText.trim()) return;
    setLoading(true);
    setResult("");

    try {
      // Example API call — replace this URL with your real endpoint
      const response = await fetch("https://api.example.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchText }),
      });

      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();

      // Assuming API returns { result: "some long text..." }
      setResult(data.result || JSON.stringify(data, null, 2));
    } catch (err) {
      console.error("Error fetching results:", err);
      setResult("Failed to fetch results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="main-cont-header">
        <Row className="page-header">
          <Col sm={12}>
            <div className="main-con-page-title-container p-2 d-flex justify-content-between align-items-center">
              <div className="title">
                <h3 className="page-title">FinnGPT</h3>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <div className="main-content-container mt-5 pt-5 px-4">
        {/* Search Area */}
        <div className="finn-search-box d-flex align-items-start gap-2 mb-4">
          <Form.Group controlId="finnSearch" className="flex-grow-1">
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Type your query"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="search-input"
            />
          </Form.Group>
          <Button
            variant="primary"
            onClick={handleSearch}
            disabled={loading}
            className="search-btn"
          >
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>

        {/* Results Area */}
        <div className="finn-results-container">
          {result ? (
            <pre className="result-text">{result}</pre>
          ) : (
            <div className="no-results text-muted text-center py-5">
              No results yet. Try searching something.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardNew;
