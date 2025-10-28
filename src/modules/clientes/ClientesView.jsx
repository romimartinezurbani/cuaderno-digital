import React, { useState } from "react";
import ClienteForm from '../../components/ClienteForm';
import ClienteTable from '../../components/ClienteTable';


const ClientesView = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <div>
      <ClienteForm onClienteAdded={() => setRefresh(!refresh)} />
      <ClienteTable key={refresh} />
    </div>
  );
};

export default ClientesView;
