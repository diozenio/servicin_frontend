import { User } from "@/core/domain/models/user";

export const getUserDisplayName = (user: User): string => {
  return (
    user?.individual?.fullName || user?.company?.corporateName || "Usuário"
  );
};

export const getUserContactPhone = (user: User): string | null => {
  const phoneContact = user.contacts.find(
    (contact) => contact.type === "PHONE"
  );

  return phoneContact ? phoneContact.value : null;
};
