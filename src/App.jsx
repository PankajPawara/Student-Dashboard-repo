import { useEffect, useState } from 'react'
import './App.css'
import { Button } from './components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Pencil, PlusCircle, Save, Trash2 } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from './components/ui/label'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function App() {

  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("")
  const [allStudents, setAllStudents] = useState(() => {
    const saved = localStorage.getItem("studentsData");
    return saved ? JSON.parse(saved) : students;
  });
  const [filteredStudents, setFilteredStudents] = useState(students)
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null)
  console.log(students)
  // Add Student Form States
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    rollNo: "",
    enrolledCourse: "",
    profileImage: ""
  });
  const [newProfileFile, setNewProfileFile] = useState(null);

  const handleAddStudent = async () => {
    const { name, email, rollNo, enrolledCourse } = newStudent;

    if (!name.trim() || !email.trim() || !rollNo.trim() || !enrolledCourse) {
      alert("Please fill all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email.");
      return;
    }

    const isDuplicateRoll = allStudents.some((s) => s.rollNo === rollNo);
    if (isDuplicateRoll) {
      alert("Roll number already exists.");
      return;
    }

    let imageDataUrl = "https://github.com/shadcn.png"; // default
    if (newProfileFile) {
      imageDataUrl = await toBase64(newProfileFile);
    }

    const studentData = {
      ...newStudent,
      profileImage: imageDataUrl
    };

    const updated = [...allStudents, studentData];
    setAllStudents(updated);
    setFilteredStudents(sortStudents(updated, sortBy));

    setNewStudent({
      name: "",
      email: "",
      rollNo: "",
      enrolledCourse: "",
      profileImage: ""
    });
    setNewProfileFile(null);

    alert("Student added successfully!");
  };

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  };

  useEffect(() => {
    setFilteredStudents(allStudents)
  }, [allStudents])

  useEffect(() => {
    localStorage.setItem("studentsData", JSON.stringify(allStudents));
    setFilteredStudents(sortStudents(allStudents, sortBy));
  }, [allStudents, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault()
    const query = searchQuery.toLowerCase()
    const results = allStudents.filter((student) =>
      student.name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      student.enrolledCourse.toLowerCase().includes(query)
    )
    setFilteredStudents(sortStudents(results, sortBy))
  }

  const handleSortChange = (value) => {
    setSortBy(value)
    const sorted = sortStudents(filteredStudents, value)
    setFilteredStudents(sorted)
  }

  const sortStudents = (list, criteria) => {
    const sorted = [...list]
    switch (criteria) {
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case "date":
        return sorted.sort((a, b) => a.rollNo.localeCompare(b.rollNo))
      case "course":
        return sorted.sort((a, b) => a.enrolledCourse.localeCompare(b.enrolledCourse))
      default:
        return list
    }
  }
  const handleDeleteStudent = (rollNoToDelete) => {
    const updatedStudents = allStudents.filter(
      (student) => student.rollNo !== rollNoToDelete
    );

    setAllStudents(updatedStudents);
    setFilteredStudents(sortStudents(updatedStudents, sortBy));
    alert("Student record deleted.");
  };

  return (
    <>
      <div className="position-sticky bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-4 shadow-md">
        <h1 className="text-3xl font-bold text-center">Student Dashboard</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 my-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">A list of students</h3>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-2 bg-white rounded-xl">

          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student"
              className="flex-grow rounded-r-none"
            />
            <Button type="submit" className="rounded-l-none bg-blue-600 dark:bg-blue-700 text-white px-10 py-4 hover:bg-blue-700 dark:hover:bg-blue-800">Search</Button>
          </form>

          {/* Sort Dropdown */}
          <Select onValueChange={handleSortChange}>
            <SelectTrigger className="w-full sm:w-1/4">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="date">Serial no</SelectItem>
              <SelectItem value="course">Course</SelectItem>
            </SelectContent>
          </Select>

          {/* Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <PlusCircle />
                Add New Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Student Details</DialogTitle>
                <DialogDescription>
                  Enter the information below to add a new student.
                </DialogDescription>
              </DialogHeader>

              {/* Name Input */}
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input
                  id="name"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>

              {/* Roll No */}
              <div className="grid gap-2">
                <Label>Roll Number</Label>
                <Input
                  id="rollNumber"
                  value={newStudent.rollNo.toUpperCase()}
                  onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })}
                  placeholder="Enter roll number"
                />
              </div>

              {/* Email Input */}
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>

              {/* Enrolled Course Select */}
              <div className="grid gap-2">
                <Label>Enrolled Course</Label>
                <Select
                  value={newStudent.enrolledCourse}
                  onValueChange={(value) =>
                    setNewStudent({ ...newStudent, enrolledCourse: value })
                  }
                >
                  <SelectTrigger id="course" className="w-[460px]">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="React In Depth">React In Depth</SelectItem>
                    <SelectItem value="JavaScript Pro">JavaScript Pro</SelectItem>
                    <SelectItem value="HTML Basics">HTML Basics</SelectItem>
                    <SelectItem value="CSS Mastery">CSS Mastery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Profile Photo Upload */}
              <div className="grid gap-2">
                <Label htmlFor="photo">Profile Photo</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setNewProfileFile(file);
                    }
                  }}
                />
                {newProfileFile && (
                  <img
                    src={URL.createObjectURL(newProfileFile)}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover mt-2"
                  />
                )}
              </div>

              <DialogFooter>
                <Button type="submit" onClick={handleAddStudent}
                  disabled={!newStudent.name || !newStudent.email || !newStudent.rollNo || !newStudent.enrolledCourse}>
                  <PlusCircle /> Add Student</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
          <Table className="min-w-full text-sm text-left text-gray-700">
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="px-4 py-2">Serial No.</TableHead>
                <TableHead className="px-4 py-2">Profile</TableHead>
                <TableHead className="px-4 py-2">Name</TableHead>
                <TableHead className="px-4 py-2">Email</TableHead>
                <TableHead className="px-4 py-2">Enrolled Courses</TableHead>
                <TableHead className="px-4 py-2 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.rollNo} className="hover:bg-gray-50 transition">
                  <TableCell className="px-4 py-2">{student.rollNo}</TableCell>
                  <TableCell className="px-4 py-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        className="object-cover"
                        src={student.profileImage || "https://github.com/shadcn.png"}
                        alt={student.name}
                      />
                      <AvatarFallback>{student.name[0]}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="px-4 py-2">{student.name}</TableCell>
                  <TableCell className="px-4 py-2">{student.email}</TableCell>
                  <TableCell className="px-4 py-2">{student.enrolledCourse}</TableCell>
                  <TableCell className="px-4 py-2 space-x-2 text-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button onClick={() => setSelectedStudent(student)} size="sm" variant="default">
                          <Pencil size={16} /> Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Student Details</DialogTitle>
                          <DialogDescription>
                            Edit the information below to update a student.
                          </DialogDescription>
                        </DialogHeader>

                        {selectedStudent && (
                          <div className="grid gap-3">
                            {/* Profile Photo */}
                            <div className="flex justify-center">
                              <Avatar className="h-35 w-35">
                                <AvatarImage
                                  src={selectedStudent.profileImage}
                                  alt={selectedStudent.name}
                                />
                                <AvatarFallback>{selectedStudent.name[0]}</AvatarFallback>
                              </Avatar>
                            </div>

                            {/* Name Input */}
                            <div className="grid gap-2">
                              <Label>Name</Label>
                              <Input
                                id="name"
                                placeholder="Enter full name"
                                value={selectedStudent.name}
                                onChange={(e) =>
                                  setSelectedStudent({ ...selectedStudent, name: e.target.value })
                                }
                              />
                            </div>

                            {/* Email Input */}
                            <div className="grid gap-2">
                              <Label>Email</Label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="Enter email address"
                                value={selectedStudent.email}
                                onChange={(e) =>
                                  setSelectedStudent({ ...selectedStudent, email: e.target.value })
                                }
                              />
                            </div>

                            {/* Name Input */}
                            <div className="grid gap-2">
                              <Label>Roll Number</Label>
                              <Input
                                id="rollNumber"
                                placeholder="Enter full name"
                                value={selectedStudent.rollNo}
                                disabled
                              />
                            </div>

                            {/* Course Select */}
                            <div className="grid gap-2">
                              <Label>Enrolled Course</Label>
                              <Select
                                value={selectedStudent.enrolledCourse}
                                onValueChange={(value) =>
                                  setSelectedStudent({ ...selectedStudent, enrolledCourse: value })
                                }
                              >
                                <SelectTrigger id="course" className="w-[460px]">
                                  <SelectValue placeholder="Select a course" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="React In Depth">React In Depth</SelectItem>
                                  <SelectItem value="JavaScript Pro">JavaScript Pro</SelectItem>
                                  <SelectItem value="HTML Basics">HTML Basics</SelectItem>
                                  <SelectItem value="CSS Mastery">CSS Mastery</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Photo Upload */}
                            <div className="grid gap-2">
                              <Label>Profile Photo</Label>
                              <Input
                                id="photo"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    setSelectedImageFile(file);
                                  }
                                }}
                              />
                            </div>

                            <DialogFooter>
                              <Button
                                type="submit"
                                onClick={async () => {
                                  let newImage = selectedStudent.profileImage;

                                  if (selectedImageFile) {
                                    newImage = await toBase64(selectedImageFile);
                                  }

                                  const updatedStudents = allStudents.map((s) =>
                                    s.rollNo === selectedStudent.rollNo
                                      ? {
                                        ...selectedStudent,
                                        profileImage: newImage,
                                      }
                                      : s
                                  );

                                  setAllStudents(updatedStudents);
                                  setFilteredStudents(sortStudents(updatedStudents, sortBy));
                                  alert("Student updated.");
                                }}

                              >
                                <Save />Save Changes
                              </Button>
                            </DialogFooter>
                          </div>
                        )}

                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 size={16} /> Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action will permanently delete <b>{student.name}</b>'s record.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteStudent(student.rollNo)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}

const students = [
  {
    rollNo: "S101",
    name: "Pankaj Pawara",
    email: "pankaj.pawara@example.com",
    enrolledCourse: "React In Depth",
    profileImage: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    rollNo: "S102",
    name: "Anita Deshmukh",
    email: "anita.deshmukh@example.com",
    enrolledCourse: "JavaScript Pro",
    profileImage: "https://randomuser.me/api/portraits/women/2.jpg"
  },
  {
    rollNo: "S103",
    name: "Rahul Patil",
    email: "rahul.patil@example.com",
    enrolledCourse: "HTML Basics",
    profileImage: "https://randomuser.me/api/portraits/men/3.jpg"
  },
  {
    rollNo: "S104",
    name: "Sneha Joshi",
    email: "sneha.joshi@example.com",
    enrolledCourse: "CSS Mastery",
    profileImage: "https://randomuser.me/api/portraits/women/4.jpg"
  },
  {
    rollNo: "S105",
    name: "Vikram Thakur",
    email: "vikram.thakur@example.com",
    enrolledCourse: "React In Depth",
    profileImage: "https://randomuser.me/api/portraits/men/5.jpg"
  },
  {
    rollNo: "S106",
    name: "Neha Khedekar",
    email: "neha.khedekar@example.com",
    enrolledCourse: "JavaScript Pro",
    profileImage: "https://randomuser.me/api/portraits/women/6.jpg"
  },
  {
    rollNo: "S107",
    name: "Amit Shinde",
    email: "amit.shinde@example.com",
    enrolledCourse: "HTML Basics",
    profileImage: "https://randomuser.me/api/portraits/men/7.jpg"
  },
  {
    rollNo: "S108",
    name: "Priya More",
    email: "priya.more@example.com",
    enrolledCourse: "CSS Mastery",
    profileImage: "https://randomuser.me/api/portraits/women/8.jpg"
  },
  {
    rollNo: "S109",
    name: "Nikhil Wagh",
    email: "nikhil.wagh@example.com",
    enrolledCourse: "JavaScript Pro",
    profileImage: "https://randomuser.me/api/portraits/men/9.jpg"
  },
  {
    rollNo: "S110",
    name: "Kavita Bhujbal",
    email: "kavita.bhujbal@example.com",
    enrolledCourse: "React In Depth",
    profileImage: "https://randomuser.me/api/portraits/women/10.jpg"
  }
];
export default App
