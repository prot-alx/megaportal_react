"use client";
import { useState, useEffect } from "react";
import {
  Requests,
  RequestStatus,
  RequestType,
  useGetRequestsQuery,
} from "@/app/services/requestApi";
import { Checkbox } from "@/shared/components/ui/checkbox";

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
    return <div>Error occurred</div>;
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
      <ul>
        {requests?.map((req) => (
          <li key={req.id}>
            {req.client_id} ||| {req.address} ||| {req.type} ||| {req.status}{" "}
            ||| {req.description}
          </li>
        ))}
      </ul>
    </div>
  );
};
