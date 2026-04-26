"use client"

import { useState } from "react"
import { DoorOpen } from "lucide-react"
import { Badge, DataPageLayout } from "../_Components/data-page-layout"

interface Room {
  id: number
  name: string
  building: string
  capacity: number
  type: string
  status: string
  equipment: string
}

const initialRooms: Room[] = [
  {
    id: 1,
    name: "A101",
    building: "Building A",
    capacity: 30,
    type: "Lecture Hall",
    status: "Available",
    equipment: "Projector, Whiteboard, Sound System",
  },
  {
    id: 2,
    name: "A102",
    building: "Building A",
    capacity: 20,
    type: "Computer Lab",
    status: "Occupied",
    equipment: "Computers, Projector",
  },
  {
    id: 3,
    name: "B201",
    building: "Building B",
    capacity: 50,
    type: "Lecture Hall",
    status: "Available",
    equipment: "Projector, Microphone, Recording",
  },
  {
    id: 4,
    name: "B203",
    building: "Building B",
    capacity: 25,
    type: "Seminar Room",
    status: "Maintenance",
    equipment: "Whiteboard, Video Conferencing",
  },
  {
    id: 5,
    name: "C105",
    building: "Building C",
    capacity: 15,
    type: "Workshop Room",
    status: "Available",
    equipment: "Workbenches, Tools",
  },
  {
    id: 6,
    name: "A202",
    building: "Building A",
    capacity: 40,
    type: "Lecture Hall",
    status: "Reserved",
    equipment: "Projector, Sound System, AC",
  },
]

const columns = [
  { key: "name", label: "Room" },
  { key: "building", label: "Building" },
  { key: "capacity", label: "Capacity" },
  { key: "type", label: "Type" },
  {
    key: "status",
    label: "Status",
    render: (item: Room) => (
      <Badge
        variant={
          item.status === "Available"
            ? "default"
            : item.status === "Occupied"
            ? "secondary"
            : item.status === "Reserved"
            ? "outline"
            : "destructive"
        }
        className={
          item.status === "Available"
            ? "bg-accent text-white"
            : item.status === "Reserved"
            ? "bg-primary/10 text-primary border-primary/20"
            : ""
        }
      >
        {item.status}
      </Badge>
    ),
  },
  { key: "equipment", label: "Equipment" },
]

const formFields = [
  { key: "name", label: "Room Name", type: "text" as const, placeholder: "e.g., A101" },
  {
    key: "building",
    label: "Building",
    type: "select" as const,
    options: [
      { label: "Building A", value: "Building A" },
      { label: "Building B", value: "Building B" },
      { label: "Building C", value: "Building C" },
    ],
  },
  { key: "capacity", label: "Capacity", type: "number" as const, placeholder: "e.g., 30" },
  {
    key: "type",
    label: "Room Type",
    type: "select" as const,
    options: [
      { label: "Lecture Hall", value: "Lecture Hall" },
      { label: "Computer Lab", value: "Computer Lab" },
      { label: "Seminar Room", value: "Seminar Room" },
      { label: "Workshop Room", value: "Workshop Room" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "select" as const,
    options: [
      { label: "Available", value: "Available" },
      { label: "Occupied", value: "Occupied" },
      { label: "Reserved", value: "Reserved" },
      { label: "Maintenance", value: "Maintenance" },
    ],
  },
  { key: "equipment", label: "Equipment", type: "textarea" as const, placeholder: "List available equipment" },
]

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>(initialRooms)

  const handleAdd = (item: Partial<Room>) => {
    const newRoom: Room = {
      id: Date.now(),
      name: item.name || "",
      building: item.building || "",
      capacity: Number(item.capacity) || 0,
      type: item.type || "",
      status: item.status || "Available",
      equipment: item.equipment || "",
    }
    setRooms([...rooms, newRoom])
  }

  const handleEdit = (item: Room) => {
    setRooms(rooms.map((r) => (r.id === item.id ? item : r)))
  }

  const handleDelete = (id: number) => {
    setRooms(rooms.filter((r) => r.id !== id))
  }

  return (
    <DataPageLayout
      title="Rooms"
      description="Manage classrooms and learning spaces"
      icon={<DoorOpen className="h-6 w-6 text-white" />}
      columns={columns}
      data={rooms}
      formFields={formFields}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  )
}
