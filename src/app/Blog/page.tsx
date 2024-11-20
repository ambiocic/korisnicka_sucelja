"use client";

import { Navigation } from "../components/Navigation";

// Sample blog data
const reviews = [
  { title: "Inception Review", image: "inception-review.jpg", category: "Review", date: "2023-10-15", author: "John Doe" },
  { title: "Dark Knight Review", image: "dark-knight-review.jpg", category: "Review", date: "2023-08-20", author: "Jane Smith" },
  { title: "Interstellar: A Deep Dive", image: "interstellar-review.jpg", category: "Review", date: "2023-06-05", author: "Chris Nolan" },
];

const announcements = [
  { title: "New Film Releases in 2024", image: "new-releases-2024.jpg", category: "Announcement", date: "2024-01-05", author: "Admin" },
  { title: "FilmNest Updates Coming Soon", image: "updates-coming.jpg", category: "Announcement", date: "2023-12-15", author: "Team" },
];

const interviews = [
  { title: "Interview with the Director of Inception", image: "inception-director.jpg", category: "Interview", date: "2023-09-10", author: "Emma Watson" },
  { title: "Stranger Things Cast Interview", image: "stranger-things-interview.jpg", category: "Interview", date: "2023-07-20", author: "David Harbour" },
];

export default function Blog() {

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Navigation Bar */}
      <Navigation />

      {/* Page Content */}
      <div className="mt-32 mx-4">

        {/* Reviews Section */}
        <section className="mb-8 px-4 margin-all-12 rounded-lg shadow-lg border">
          <h2 className="text-2xl font-bold my-4">Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-4">
            {reviews.map((review, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg border">
                <img src={review.image} alt={review.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{review.title}</h3>
                  <p className="text-sm text-gray-400">{review.category}</p>
                  <p className="text-sm text-gray-400">Date: {review.date}</p>
                  <p className="text-sm text-gray-400">Author: {review.author}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Announcements Section */}
        <section className="mb-8 px-4 rounded-lg shadow-lg border">
          <h2 className="text-2xl font-bold my-4">Announcements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-4">
            {announcements.map((announcement, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg border">
                <img src={announcement.image} alt={announcement.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{announcement.title}</h3>
                  <p className="text-sm text-gray-400">{announcement.category}</p>
                  <p className="text-sm text-gray-400">Date: {announcement.date}</p>
                  <p className="text-sm text-gray-400">Author: {announcement.author}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Interviews Section */}
        <section className="mb-8 px-4 shadow-lg rounded-lg border">
          <h2 className="text-2xl font-bold my-4">Interviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-4">
            {interviews.map((interview, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg border">
                <img src={interview.image} alt={interview.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{interview.title}</h3>
                  <p className="text-sm text-gray-400">{interview.category}</p>
                  <p className="text-sm text-gray-400">Date: {interview.date}</p>
                  <p className="text-sm text-gray-400">Author: {interview.author}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Section */}
        <footer className="text-center text-sm text-gray-400 pb-6">
          <p>&copy; {new Date().getFullYear()} FilmNest. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}
