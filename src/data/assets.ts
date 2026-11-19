import heroStepsImg from "@/src/assets/images/hero_supreme_court_steps_1794771517044.jpg";
import sanjayChambersPortraitImg from "@/src/assets/images/sanjay_chambers_portrait_1794780141259.jpg";
import sanjayCounselDeskImg from "@/src/assets/images/sanjay_counsel_desk_1794780143991.jpg";
import sanjayCourtCorridorImg from "@/src/assets/images/sanjay_court_corridor_1794780143250.jpg";
import supremeCourtImg from "@/src/assets/images/real_supreme_court.jpg";
import gstatDelhiImg from "@/src/assets/images/real_gstat_delhi.jpg";
import delhiHighImg from "@/src/assets/images/real_delhi_hc.jpg";
import chandigarhHighImg from "@/src/assets/images/real_chandigarh_hc.jpg";
import rajasthanHighImg from "@/src/assets/images/real_rajasthan_hc.jpg";
import allahabadHighImg from "@/src/assets/images/real_allahabad_hc.jpg";
import gujaratHighImg from "@/src/assets/images/real_gujarat_hc.jpg";
import patnaHighImg from "@/src/assets/images/real_patna_hc.jpg";
import bombayHighImg from "@/src/assets/images/real_bombay_hc.jpg";
import telanganaHighImg from "@/src/assets/images/real_telangana_hc.jpg";
import calcuttaHighImg from "@/src/assets/images/real_calcutta_hc.jpg";
import karnatakaHighImg from "@/src/assets/images/real_karnataka_hc.jpg";
import madrasHighImg from "@/src/assets/images/real_madras_hc.jpg";
import type { CourtImageKey } from "./courtsRegistry";

export const HERO_IMAGE = heroStepsImg;
export const ADVOCATE_PORTRAIT_IMAGE = sanjayChambersPortraitImg;
export const ADVOCATE_DESK_IMAGE = sanjayCounselDeskImg;
export const ADVOCATE_CORRIDOR_IMAGE = sanjayCourtCorridorImg;

export const COURT_IMAGES: Record<CourtImageKey, string> = {
  "supreme-court-of-india": supremeCourtImg,
  gstat: gstatDelhiImg,
  "delhi-high-court": delhiHighImg,
  "punjab-haryana-high-court": chandigarhHighImg,
  "rajasthan-high-court": rajasthanHighImg,
  "allahabad-high-court": allahabadHighImg,
  "gujarat-high-court": gujaratHighImg,
  "patna-high-court": patnaHighImg,
  "bombay-high-court": bombayHighImg,
  "telangana-high-court": telanganaHighImg,
  "calcutta-high-court": calcuttaHighImg,
  "karnataka-high-court": karnatakaHighImg,
  "madras-high-court": madrasHighImg
};
