import React from 'react';

interface ProfileProps {
  image: string;
}

const Profile: React.FC<ProfileProps> = ({ image }) => {
  return (
    <div className="absolute top-4 right-4 w-12 h-12 rounded-full overflow-hidden border-2 border-white">
      <img src={image} alt="Profile" className="w-full h-full object-cover" />
    </div>
  );
};

export default Profile;
