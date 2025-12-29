import { MessageCircle, Instagram, X } from 'lucide-react';
import { useState } from 'react';

export default function FloatingContact() {
  const [open, setOpen] = useState(false);

  const whatsappLink = 'https://wa.me/5493584244240';
  const instagramLink = 'https://instagram.com/admify';

  return (
    <div className="fab-container">
      {open && (
        <div className="fab-menu">
          <a href={whatsappLink} target="_blank">WhatsApp</a>
          <a href={instagramLink} target="_blank">Instagram</a>
        </div>
      )}

      <button className="fab-button" onClick={() => setOpen(!open)}>
        {open ? <X /> : <MessageCircle />}
      </button>
    </div>
  );
}
