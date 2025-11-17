// app/word-game/page.tsx
import dynamic from "next/dynamic";
import { Robot } from "../../ui/components/Robot";

const ClientGame = dynamic(
  () => import("../../ui/components/ClientGame/ClientGame"),
  {
    ssr: false,
    loading: () => <Robot />,
  }
);

export default function Page() {
  return <ClientGame />;
}
