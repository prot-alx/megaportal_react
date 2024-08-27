"use client";
import { useState, useEffect } from "react";
import {
  Requests,
  RequestStatus,
  RequestType,
  useGetRequestsQuery,
} from "@/app/services/requestApi";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

const requestTypes = Object.values(RequestType);

export const UnassignedRequests: React.FC = () => {
  const [selectedTypes, setSelectedTypes] = useState<RequestType[]>(() => {
    const savedTypes = localStorage.getItem("selectedTypes");
    return savedTypes ? JSON.parse(savedTypes) : requestTypes;
  });

  const [requests, setRequests] = useState<Requests[]>([]);
  const status = RequestStatus.New;

  const {
    data: fetchedRequests,
    error,
    isLoading,
  } = useGetRequestsQuery({
    status,
    type: selectedTypes.length > 0 ? selectedTypes : undefined,
  });

  useEffect(() => {
    if (selectedTypes.length === 0) {
      setRequests([]);
    } else if (fetchedRequests) {
      const filteredRequests = fetchedRequests.filter((req) =>
        selectedTypes.includes(req.type)
      );
      setRequests(filteredRequests);
    }
  }, [fetchedRequests, selectedTypes]);

  useEffect(() => {
    localStorage.setItem("selectedTypes", JSON.stringify(selectedTypes));
  }, [selectedTypes]);

  const handleCheckboxChange = (type: RequestType) => {
    setSelectedTypes((prevTypes) =>
      prevTypes.includes(type)
        ? prevTypes.filter((t) => t !== type)
        : [...prevTypes, type]
    );
  };

  if (isLoading) return <div>Loading...</div>;

  if (error) {
    return <div>Error occurred: {JSON.stringify(error)}</div>;
  }

  return (
    <div>
      <div className="flex gap-6 flex-wrap mb-4">
        {requestTypes.map((type) => (
          <div key={type} className="flex items-center space-x-2">
            <Checkbox
              id={type}
              checked={selectedTypes.includes(type)}
              onCheckedChange={() => handleCheckboxChange(type)}
            />
            <label htmlFor={type} className="text-sm font-medium">
              {type}
            </label>
          </div>
        ))}
      </div>
      <Table className="min-w-full bg-white">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Абонент</TableHead>
            <TableHead>Адрес</TableHead>
            <TableHead>Описание</TableHead>
            <TableHead>Контактные данные</TableHead>
            <TableHead>Дата выезда</TableHead>
            <TableHead>Тип</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((req) => (
            <TableRow key={req.id}>
              <TableCell>{req.id}</TableCell>
              <TableCell>{req.client_id}</TableCell>
              <TableCell>{req.address}</TableCell>
              <TableCell>{req.description}</TableCell>
              <TableCell>{req.client_contacts}</TableCell>
              <TableCell>{req.request_date}</TableCell>
              <TableCell>{req.type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
