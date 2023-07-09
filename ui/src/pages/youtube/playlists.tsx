// @ts-nocheck
import axios from "axios";
import jsCookie from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import dynamic from "next/dynamic";
const PlaylistTable = dynamic(
  () => import("@/components/youtube/playlist_table"),
  { ssr: false }
);

function Playlists() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  function selectedItemsFunc(args: string[]) {
    setSelectedItems(args);
  }
  async function fetcher() {
    try {
      const response = await axios.get(
        "http://localhost:8080" + "/api/youtube-playlist",
        {
          headers: {
            Authorization: `${jsCookie.get("yt-token")}`,
          },
        }
      );
      console.log(JSON.parse(response.data.playlists).items);
      setData(JSON.parse(response.data.playlists).items);
    } catch (error: any) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (router?.isReady) {
      fetcher();
    }
  }, [router?.isReady]);

  return (
    <div className="mx-5 md:mx-0">
      <PlaylistTable data={data} selectedItemsFunc={selectedItemsFunc} />
    </div>
  );
}

export default Playlists;