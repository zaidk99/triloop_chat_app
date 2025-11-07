import React from "react";
import PublicRoomCards from "../components/PublicRoomCards";


const publicChatrooms = [
  {
    name: "Tech Innovators Hub",
    members: 120,
    status: 35,
    description:
      "A place where technology lovers share ideas, discuss new trends, and collaborate on creative projects for the future."
  },
  {
    name: "Daily Fitness Chat",
    members: 85,
    status: 20,
    description:
      "Join us to share workout tips, healthy recipes, and motivation to achieve your daily fitness and wellness goals."
  },
  {
    name: "Bookworms Lounge",
    members: 64,
    status: 15,
    description:
      "Discuss your favorite books, discover hidden gems, and connect with fellow readers from around the world."
  },
  {
    name: "Photography World",
    members: 92,
    status: 28,
    description:
      "A friendly space for photographers to showcase their work, share tips, and explore new creative techniques."
  },
  {
    name: "Gaming Arena",
    members: 150,
    status: 50,
    description:
      "Hang out with gamers of all genres, join live game sessions, and discuss strategies, updates, and game news."
  },
  {
    name: "Music Lovers Spot",
    members: 110,
    status: 40,
    description:
      "Share playlists, talk about your favorite artists, and discover new music with fellow enthusiasts."
  },
  {
    name: "Mindful Living Group",
    members: 78,
    status: 18,
    description:
      "A peaceful space to learn mindfulness, share meditation tips, and support each other in living with intention."
  },
  {
    name: "Startup Founders Hub",
    members: 57,
    status: 12,
    description:
      "A supportive group for entrepreneurs to exchange ideas, pitch concepts, and help each other grow their businesses."
  },
  {
    name: "Cooking Experiments",
    members: 83,
    status: 25,
    description:
      "Share recipes, cooking hacks, and kitchen experiments while learning from the experiences of fellow food lovers."
  },
  {
    name: "Travel and Adventure",
    members: 140,
    status: 33,
    description:
      "Exchange travel tips, share stunning trip photos, and connect with others who love exploring the world."
  }
];


const PublicRooms = () => {
  return (
    <div className="font-montserrat-regular px-5 max-h-[87vh] overflow-auto mt-3 ">
      <div className="sticky top-0 z-10 bg-white py-2 ">
        <h1 className="lg:text-4xl md:text-3xl text-2xl font-medium bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent inline-block p-2 ">
          Public Chatrooms
        </h1>
      </div>
      <div className="pt-7 grid lg:grid-cols-3  md:grid-cols-2 sm:grid-cols-1 gap-5 ">
        {publicChatrooms.map((eachPublicChatroom, index) => (
          <div key={index}>
            <PublicRoomCards
              name={eachPublicChatroom.name}
              members={eachPublicChatroom.members}
              status={eachPublicChatroom.status}
              description={eachPublicChatroom.description}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicRooms;
