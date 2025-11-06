import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Form } from "react-bootstrap";
import "./index.css";


const DashboardNew = () => {
  const [searchText, setSearchText] = useState("");
  const [messages, setMessages] = useState<Array<{query: string, result: any}>>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSearch();
    }
  };

  const handleSearch = async () => {
    if (!searchText.trim() || loading) return;
    
    const currentQuery = searchText;
    setSearchText("");
    setLoading(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const response = await fetch(
        `https://finnapi.sellingpartnerservice.com/ReportAgent?Query=${encodeURIComponent(currentQuery)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();

      // Extract only the result field
      let resultData = data.result;
      
      // If result is a string, try to parse it as JSON
      if (typeof resultData === 'string') {
        try {
          resultData = JSON.parse(resultData);
        } catch (e) {
          // Keep as string if not valid JSON
        }
      }

      setMessages(prev => [...prev, { 
        query: currentQuery, 
        result: resultData 
      }]);
    } catch (err) {
      console.error("Error fetching results:", err);
      setMessages(prev => [...prev, { 
        query: currentQuery, 
        result: "Failed to fetch results. Please try again." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSearchText(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  };

   const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };


  return (
    <DashboardLayout>
      <div className="finngpt-wrapper">
        <div className="finngpt-header">
          <h1 className="finngpt-title">FinnGPT</h1>
        </div>

        <div className="finngpt-main">
          {messages.length === 0 ? (
            <div className="finngpt-initial-view">
              <h2 className="finngpt-welcome-text">What can I help with?</h2>
              <div className="finngpt-centered-input">
                <div className="finngpt-input-wrapper chatgpt-style">
                  <Form.Control
                    ref={textareaRef}
                    as="textarea"
                    rows={1}
                    placeholder="Ask anything..."
                    value={searchText}
                    onChange={handleTextareaChange}
                    onKeyPress={handleKeyPress}
                    className="finngpt-input chatgpt-input"
                    disabled={loading}
                  />
                  {searchText.trim() && (
                    <button
                      className="finngpt-send-btn chatgpt-send"
                      onClick={handleSearch}
                      disabled={loading}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M7 11L12 6L17 11M12 18V7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="finngpt-messages-container">
                {messages.map((msg, index) => (
                  <div key={index} className="finngpt-message-pair">
                    <div className="finngpt-user-row">
                      <div className="finngpt-message-content">
                        <div className="finngpt-user-message">{msg.query}</div>
                      </div>
                    </div>

                    <div className="finngpt-assistant-row">
                      <div className="finngpt-message-content">
                        <div className="finngpt-copy-container">
                          <button
                                  className="finngpt-copy-btn"
                                  onClick={() =>
                                    handleCopy(
                                      typeof msg.result === "string"
                                        ? msg.result
                                        : JSON.stringify(msg.result, null, 2),
                                      index
                                    )
                                  }
                                >
                                  {copiedIndex === index ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                      <path
                                        d="M20 6L9 17L4 12"
                                        stroke="#4caf50"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  ) : (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                      <rect
                                        x="9"
                                        y="9"
                                        width="13"
                                        height="13"
                                        rx="2"
                                        ry="2"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                      />
                                      <path
                                        d="M5 15H4a2 2 0 0 1-2-2V4
                                              a2 2 0 0 1 2-2h9
                                              a2 2 0 0 1 2 2v1"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                      />
                                    </svg>
                                  )}
                                </button>

                        </div>
                        <div className="finngpt-assistant-message chatgpt-response">
                          <pre className="finngpt-json-result">
                            {typeof msg.result === "string"
                              ? msg.result
                              : JSON.stringify(msg.result, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="finngpt-assistant-row">
                    <div className="finngpt-message-content">
                      <div className="finngpt-assistant-message chatgpt-response">
                        <div className="finngpt-loading">Thinking...</div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="finngpt-input-container">
                <div className="finngpt-input-wrapper chatgpt-style">
                  <Form.Control
                    ref={textareaRef}
                    as="textarea"
                    rows={1}
                    placeholder="Ask anything..."
                    value={searchText}
                    onChange={handleTextareaChange}
                    onKeyPress={handleKeyPress}
                    className="finngpt-input chatgpt-input"
                    disabled={loading}
                  />
                  {searchText.trim() && (
                    <button
                      className="finngpt-send-btn chatgpt-send"
                      onClick={handleSearch}
                      disabled={loading}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M7 11L12 6L17 11M12 18V7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardNew;