import React, { useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import { FaRegEye } from "react-icons/fa";
import { toast } from "sonner";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "../components/ui/pagination";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../components/ui/select";
import { emailApi, type EmailRecord } from "../lib/api";

const fields = [
  "Sender Mail",
  "Receiver Mail",
  "Status",
  "Sent At",
  "Responds",
  "Sub",
  "Body",
];

const PAGE_SIZES = [10, 20, 50, 100, 500, "All"] as const;

const EmailAutomationSummary = () => {
  const [data, setData] = useState<EmailRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | "All">(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [hoveredBody, setHoveredBody] = useState<{ content: string; x: number; y: number } | null>(null);
  const [respondsFilter, setRespondsFilter] = useState('all');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });

  // Responds filter options
  const respondsOptions = [
    { label: 'All', value: 'all' },
    { label: 'Responds', value: 'Responds' },
    { label: 'No Response Yet', value: 'No Response Yet' },
    { label: 'Unsubscribed', value: 'Unsubscribed' },
  ];

  // Fetch data from API - Backend handles pagination
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      setLoading(true);
      toast.dismiss(); // Dismiss any existing toasts
      
      try {
        // When "All" is selected, send total_records or a large number
        const perPageValue = pageSize === "All" ? 100000 : pageSize;
        
        const response = await emailApi.getEmails({
          page,
          per_page: perPageValue,
          date,
        });
        
        if (!isMounted) return; // Prevent toast if component unmounted
        
        setData(response.data.records);
        setTotalPages(response.data.pagination.total_pages);
        setTotalRecords(response.data.pagination.total_records);
        // Show success toast
        if (response.data.records.length > 0) {
          toast.success(`Successfully loaded ${response.data.records.length} records`);
        } else {
          toast.info('No records found for the selected date');
        }
      } catch (err) {
        if (!isMounted) return; // Prevent toast if component unmounted
        
        // Show error toast
        console.error('Error fetching emails:', err);
        toast.error('Unable to load email data. Please check your connection and try again.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [page, pageSize, date]);

  // Filter data by responds (frontend only)
  const filteredData = respondsFilter && respondsFilter !== 'all'
    ? data.filter(record => record.responds === respondsFilter)
    : data;

  // Convert API records to table rows
  const pagedData = filteredData.map(record => [
    record.sender_email,
    record.receiver_email,
    record.status,
    new Date(record.sent_at).toLocaleString(),
    record.responds,
    record.subject || 'N/A',
    record.body || 'N/A',
  ]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center tracking-tight">Email Automation Summary</h1>
      <div className="w-full max-w-7xl">
        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-blue-900">Date:</label>
            <Input
              type="date"
              className="w-40 border-blue-300 focus-visible:ring-blue-400 focus-visible:border-blue-400 rounded text-sm"
              value={date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setDate(e.target.value);
                setPage(1); // Reset to first page when date changes
              }}
              max={new Date().toISOString().slice(0, 10)}
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-blue-900">Responds:</label>
            <Select value={respondsFilter} onValueChange={setRespondsFilter}>
              <SelectTrigger className="w-44 border-blue-300 focus:ring-blue-400 focus:border-blue-400">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                {respondsOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-blue-900 font-medium">
            Total Records: {totalRecords}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Table */}
        {!loading && (
          <div className="rounded-2xl shadow-xl overflow-hidden border-2 border-blue-400 animate-fade-in">
          <Table className="bg-white text-base">
            <TableHeader>
              <TableRow>
                {fields.map((field, idx) => (
                  <TableHead
                    key={field}
                    className={
                      "bg-blue-600 border-b border-blue-400 px-6 py-4 text-base font-extrabold text-white tracking-wide" +
                      (idx !== fields.length - 1 ? " border-r border-blue-600" : "") +
                      " first:rounded-tl-2xl last:rounded-tr-2xl"
                    }

                  >
                    {field}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedData.map((row, i) => (
                <TableRow
                  key={i}
                  className={
                    "border-b border-blue-180 transition-colors duration-200" +
                    (i % 2 === 0 ? " bg-white" : " bg-blue-50") +
                    " hover:bg-blue-100"
                  }
                >
                  {row.map((cell, j) => {
                    // If this is the 'Body' column, truncate and show tooltip on hover
                    if (fields[j] === "Body") {
                      return (
                        <TableCell
                          key={j}
                          className={
                            "px-6 py-4 text-sm border-r border-blue-200 text-blue-900 font-medium max-w-xs truncate relative flex items-center gap-2" +
                            (j === row.length - 1 ? " border-r-0" : "") +
                            " first:rounded-bl-2xl last:rounded-br-2xl"
                          }
                        >
                          <span className="truncate inline-block max-w-35 align-middle">
                            {cell}
                          </span>
                          <span
                            className="ml-1 text-blue-600 hover:text-blue-900 focus:outline-none cursor-pointer relative"
                            aria-label="View full body"
                            onMouseEnter={e => {
                              const rect = (e.target as HTMLElement).getBoundingClientRect();
                              setHoveredBody({ content: cell, x: rect.left + rect.width / 2, y: rect.bottom });
                            }}
                            onMouseLeave={() => setHoveredBody(null)}
                          >
                            <FaRegEye size={18} />
                            {hoveredBody && hoveredBody.content === cell && (
                              <div
                                className="fixed z-50 bg-white rounded-lg shadow-xl p-3 text-blue-900 text-xs max-w-md w-md border border-blue-300 wrap-break-word whitespace-pre-line"
                                style={{ left: hoveredBody.x - 420, top: hoveredBody.y + 8 }}
                              >
                                {cell}
                              </div>
                            )}
                          </span>
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell
                        key={j}
                        className={
                          "px-6 py-4 text-sm border-r border-blue-200 text-blue-900 font-medium" +
                          (j === row.length - 1 ? " border-r-0" : "") +
                          " first:rounded-bl-2xl last:rounded-br-2xl"
                        }
                      >
                        {cell}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        )}
        
        {/* Pagination */}
        {!loading && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
          <div className="flex items-center gap-2 order-1 md:order-0">
            <span className="text-sm text-muted-foreground">Rows per page:</span>
            <Select 
              value={pageSize.toString()} 
              onValueChange={val => { 
                setPageSize(val === "All" ? "All" : Number(val)); 
                setPage(1); 
              }}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZES.map(size => (
                  <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1" />
          <div className="order-2 md:order-0">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    aria-disabled={page === 1 || pageSize === "All"}
                    tabIndex={page === 1 || pageSize === "All" ? -1 : 0}
                    style={page === 1 || pageSize === "All" ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                  />
                </PaginationItem>
                {pageSize !== "All" && Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={p === page}
                      onClick={() => setPage(p)}
                      tabIndex={0}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {pageSize === "All" && (
                  <PaginationItem>
                    <PaginationLink isActive={true}>
                      All
                    </PaginationLink>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    aria-disabled={page === totalPages || pageSize === "All"}
                    tabIndex={page === totalPages || pageSize === "All" ? -1 : 0}
                    style={page === totalPages || pageSize === "All" ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
        )}
      </div>
      {/* No modal, handled by hover tooltip above */}
    </div>
  );
}

export default EmailAutomationSummary;
