import AjouterContact from './AjouterContact';

const RechercheContact = ({ searchResults }) => {
  return (
    <div>
      <ul className='my-6'>
        {searchResults.map((user) => (
          <li className='flex justify-between text-lg font-regular my-2 bg-neutral-900 p-4 rounded-xl' key={user.email}>
            {user.nom}
            <AjouterContact contact={user} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RechercheContact;
