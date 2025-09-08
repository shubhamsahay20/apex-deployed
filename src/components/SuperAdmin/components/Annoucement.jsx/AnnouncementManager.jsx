
"use client"

import { useState } from "react"
import AnnouncementsList from "./AnnouncementsList"
import CreateAnnouncement from "./CreateAnnouncement"
import EditAnnouncement from "./EditAnnouncement"

export default function AnnouncementManager() {
  const [currentView, setCurrentView] = useState("list")
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null)

  const handleAddClick = () => {
    setCurrentView("create")
  }

  const handleEditClick = (announcementId) => {
    setSelectedAnnouncement(announcementId)
    setCurrentView("edit")
  }

  const handleDeleteClick = (id) => {
    // Handle delete logic here
    console.log("Delete announcement - :", id)
    // You can add confirmation dialog and actual delete logic here
  }

  const handleCreateSubmit = (data) => {
    // Handle create logic here
    console.log("Create announcement:", data)
    // You can add API call or state management here
    setCurrentView("list")
  }

  const handleEditSubmit = (data) => {
    // Handle edit logic here
    console.log("Edit announcement:", data)
    // You can add API call or state management here
    setCurrentView("list")
  }

  const handleCancel = () => {
    setCurrentView("list")
    setSelectedAnnouncement(null)
  }

  switch (currentView) {
    case "create":
      return <CreateAnnouncement onSubmit={handleCreateSubmit} onCancel={handleCancel} />
    case "edit":
      return (
        <EditAnnouncement announcement={selectedAnnouncement} onSubmit={handleEditSubmit} onCancel={handleCancel} />
      )
    default:
      return (
        <AnnouncementsList
          onAddClick={handleAddClick}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />
      )
  }
}

