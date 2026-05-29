/**
 * Curated icon registry. Mirrors the categories from the Figma source
 * (RED Product Expression Containers, node 165:21000) using the
 * lucide-react icon set. Each lucide icon component has a static
 * `iconNode` property exposing the raw SVG primitives, which lets us
 * serialize the icon to an HTML string for the snippet export.
 */
import {
  // Suggested (defaults per secondary type)
  Image as ImageLucide,
  Pencil,
  Images,
  Layers,
  Sparkles,
  Search,
  Type,
  Wand2,
  Bot,
  PenTool,
  // Generative AI
  Brain,
  Cpu,
  CircuitBoard,
  Zap,
  WandSparkles,
  // User
  User,
  Users,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  UserCog,
  UserCircle,
  UserRound,
  MessageCircle,
  MessageSquare,
  Smile,
  Frown,
  // Creative
  Palette,
  Brush,
  Pen,
  Scissors,
  Crop,
  Eraser,
  Highlighter,
  Paintbrush,
  Paintbrush2,
  Droplet,
  Aperture,
  Camera,
  Film,
  // Browsers and devices
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Watch,
  Tv,
  Speaker,
  Mouse,
  Keyboard,
  Printer,
  // Cloud
  Cloud,
  CloudUpload,
  CloudDownload,
  CloudOff,
  CloudCog,
  // Global
  Globe,
  Globe2,
  Languages,
  MapPin,
  Map as MapLucide,
  Compass,
  // Share and actions
  Share,
  Share2,
  Link,
  Link2,
  Send,
  Reply,
  Forward,
  Bookmark,
  Heart,
  Star,
  Flag,
  ThumbsUp,
  ThumbsDown,
  Download,
  Upload,
  ExternalLink,
  // Files and folders
  File as FileLucide,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FilePlus,
  FileX,
  Folder,
  FolderOpen,
  FolderPlus,
  FolderMinus,
  FolderTree,
  // Settings
  Settings,
  Settings2,
  Sliders,
  SlidersHorizontal,
  ToggleLeft,
  ToggleRight,
  Wrench,
  Cog,
  // Playback and media
  Play,
  Pause,
  StopCircle,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Music,
  Headphones,
  Video,
  VideoOff,
  Radio,
  // Alerts and security
  Bell,
  BellOff,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Key,
  AlertTriangle,
  AlertCircle,
  Info,
  HelpCircle,
  // Lines and arrows
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Move,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  Plus,
  Minus,
  X,
  Check,
  // Calendar and planning
  Calendar,
  CalendarDays,
  CalendarPlus,
  CalendarCheck,
  CalendarX,
  Clock,
  Timer,
  AlarmClock,
  Hourglass,
  // Industries
  Building,
  Building2,
  Store,
  Factory,
  Briefcase,
  ShoppingBag,
  ShoppingCart,
  Truck,
  Plane,
  Car,
  // Miscellaneous
  Trash,
  Trash2,
  Copy,
  ClipboardCopy,
  Eye,
  EyeOff,
  Home,
  Filter,
  type LucideIcon,
} from "lucide-react";

export type IconEntry = {
  name: string;        // kebab-case identifier we store in state
  label: string;       // human-readable label
  Component: LucideIcon;
};

export type IconCategory = {
  name: string;
  icons: IconEntry[];
};

const e = (name: string, label: string, C: LucideIcon): IconEntry => ({
  name,
  label,
  Component: C,
});

export const ICON_CATEGORIES: IconCategory[] = [
  {
    name: "Suggested",
    icons: [
      e("image", "Image", ImageLucide),
      e("pencil", "Pencil", Pencil),
      e("images", "Images", Images),
      e("layers", "Layers", Layers),
      e("sparkles", "Sparkles", Sparkles),
      e("search", "Search", Search),
      e("type", "Type", Type),
      e("wand-2", "Wand", Wand2),
      e("bot", "Bot", Bot),
      e("pen-tool", "Pen tool", PenTool),
    ],
  },
  {
    name: "Generative AI",
    icons: [
      e("sparkles", "Sparkles", Sparkles),
      e("wand-sparkles", "Wand sparkles", WandSparkles),
      e("wand-2", "Wand", Wand2),
      e("brain", "Brain", Brain),
      e("bot", "Bot", Bot),
      e("cpu", "CPU", Cpu),
      e("circuit-board", "Circuit board", CircuitBoard),
      e("zap", "Zap", Zap),
    ],
  },
  {
    name: "User",
    icons: [
      e("user", "User", User),
      e("user-round", "User round", UserRound),
      e("user-circle", "User circle", UserCircle),
      e("users", "Users", Users),
      e("user-plus", "User plus", UserPlus),
      e("user-minus", "User minus", UserMinus),
      e("user-check", "User check", UserCheck),
      e("user-x", "User x", UserX),
      e("user-cog", "User cog", UserCog),
      e("message-circle", "Message circle", MessageCircle),
      e("message-square", "Message square", MessageSquare),
      e("smile", "Smile", Smile),
      e("frown", "Frown", Frown),
    ],
  },
  {
    name: "Creative",
    icons: [
      e("palette", "Palette", Palette),
      e("brush", "Brush", Brush),
      e("paintbrush", "Paintbrush", Paintbrush),
      e("paintbrush-2", "Paintbrush 2", Paintbrush2),
      e("pen", "Pen", Pen),
      e("pen-tool", "Pen tool", PenTool),
      e("pencil", "Pencil", Pencil),
      e("highlighter", "Highlighter", Highlighter),
      e("eraser", "Eraser", Eraser),
      e("scissors", "Scissors", Scissors),
      e("crop", "Crop", Crop),
      e("droplet", "Droplet", Droplet),
      e("aperture", "Aperture", Aperture),
      e("camera", "Camera", Camera),
      e("film", "Film", Film),
    ],
  },
  {
    name: "Browsers and devices",
    icons: [
      e("monitor", "Monitor", Monitor),
      e("laptop", "Laptop", Laptop),
      e("tablet", "Tablet", Tablet),
      e("smartphone", "Smartphone", Smartphone),
      e("watch", "Watch", Watch),
      e("tv", "TV", Tv),
      e("speaker", "Speaker", Speaker),
      e("mouse", "Mouse", Mouse),
      e("keyboard", "Keyboard", Keyboard),
      e("printer", "Printer", Printer),
    ],
  },
  {
    name: "Cloud",
    icons: [
      e("cloud", "Cloud", Cloud),
      e("cloud-upload", "Cloud upload", CloudUpload),
      e("cloud-download", "Cloud download", CloudDownload),
      e("cloud-off", "Cloud off", CloudOff),
      e("cloud-cog", "Cloud cog", CloudCog),
    ],
  },
  {
    name: "Global",
    icons: [
      e("globe", "Globe", Globe),
      e("globe-2", "Globe 2", Globe2),
      e("languages", "Languages", Languages),
      e("map", "Map", MapLucide),
      e("map-pin", "Map pin", MapPin),
      e("compass", "Compass", Compass),
    ],
  },
  {
    name: "Share and actions",
    icons: [
      e("share", "Share", Share),
      e("share-2", "Share 2", Share2),
      e("link", "Link", Link),
      e("link-2", "Link 2", Link2),
      e("send", "Send", Send),
      e("reply", "Reply", Reply),
      e("forward", "Forward", Forward),
      e("download", "Download", Download),
      e("upload", "Upload", Upload),
      e("external-link", "External link", ExternalLink),
      e("bookmark", "Bookmark", Bookmark),
      e("heart", "Heart", Heart),
      e("star", "Star", Star),
      e("flag", "Flag", Flag),
      e("thumbs-up", "Thumbs up", ThumbsUp),
      e("thumbs-down", "Thumbs down", ThumbsDown),
    ],
  },
  {
    name: "Files and folders",
    icons: [
      e("file", "File", FileLucide),
      e("file-text", "File text", FileText),
      e("file-image", "File image", FileImage),
      e("file-video", "File video", FileVideo),
      e("file-audio", "File audio", FileAudio),
      e("file-plus", "File plus", FilePlus),
      e("file-x", "File x", FileX),
      e("folder", "Folder", Folder),
      e("folder-open", "Folder open", FolderOpen),
      e("folder-plus", "Folder plus", FolderPlus),
      e("folder-minus", "Folder minus", FolderMinus),
      e("folder-tree", "Folder tree", FolderTree),
    ],
  },
  {
    name: "Settings",
    icons: [
      e("settings", "Settings", Settings),
      e("settings-2", "Settings 2", Settings2),
      e("sliders", "Sliders", Sliders),
      e("sliders-horizontal", "Sliders horizontal", SlidersHorizontal),
      e("toggle-left", "Toggle left", ToggleLeft),
      e("toggle-right", "Toggle right", ToggleRight),
      e("wrench", "Wrench", Wrench),
      e("cog", "Cog", Cog),
    ],
  },
  {
    name: "Playback and media",
    icons: [
      e("play", "Play", Play),
      e("pause", "Pause", Pause),
      e("stop-circle", "Stop", StopCircle),
      e("skip-back", "Skip back", SkipBack),
      e("skip-forward", "Skip forward", SkipForward),
      e("rewind", "Rewind", Rewind),
      e("fast-forward", "Fast forward", FastForward),
      e("volume-2", "Volume", Volume2),
      e("volume-x", "Volume off", VolumeX),
      e("mic", "Mic", Mic),
      e("mic-off", "Mic off", MicOff),
      e("music", "Music", Music),
      e("headphones", "Headphones", Headphones),
      e("video", "Video", Video),
      e("video-off", "Video off", VideoOff),
      e("radio", "Radio", Radio),
    ],
  },
  {
    name: "Alerts and security",
    icons: [
      e("bell", "Bell", Bell),
      e("bell-off", "Bell off", BellOff),
      e("shield", "Shield", Shield),
      e("shield-check", "Shield check", ShieldCheck),
      e("shield-alert", "Shield alert", ShieldAlert),
      e("lock", "Lock", Lock),
      e("unlock", "Unlock", Unlock),
      e("key", "Key", Key),
      e("alert-triangle", "Alert triangle", AlertTriangle),
      e("alert-circle", "Alert circle", AlertCircle),
      e("info", "Info", Info),
      e("help-circle", "Help circle", HelpCircle),
    ],
  },
  {
    name: "Lines and arrows",
    icons: [
      e("arrow-up", "Arrow up", ArrowUp),
      e("arrow-down", "Arrow down", ArrowDown),
      e("arrow-left", "Arrow left", ArrowLeft),
      e("arrow-right", "Arrow right", ArrowRight),
      e("arrow-up-right", "Arrow up right", ArrowUpRight),
      e("arrow-down-left", "Arrow down left", ArrowDownLeft),
      e("chevron-up", "Chevron up", ChevronUp),
      e("chevron-down", "Chevron down", ChevronDown),
      e("chevron-left", "Chevron left", ChevronLeft),
      e("chevron-right", "Chevron right", ChevronRight),
      e("move", "Move", Move),
      e("maximize", "Maximize", Maximize),
      e("minimize", "Minimize", Minimize),
      e("rotate-ccw", "Rotate counter-clockwise", RotateCcw),
      e("rotate-cw", "Rotate clockwise", RotateCw),
      e("plus", "Plus", Plus),
      e("minus", "Minus", Minus),
      e("x", "X / close", X),
      e("check", "Check", Check),
    ],
  },
  {
    name: "Calendar and planning",
    icons: [
      e("calendar", "Calendar", Calendar),
      e("calendar-days", "Calendar days", CalendarDays),
      e("calendar-plus", "Calendar plus", CalendarPlus),
      e("calendar-check", "Calendar check", CalendarCheck),
      e("calendar-x", "Calendar x", CalendarX),
      e("clock", "Clock", Clock),
      e("timer", "Timer", Timer),
      e("alarm-clock", "Alarm clock", AlarmClock),
      e("hourglass", "Hourglass", Hourglass),
    ],
  },
  {
    name: "Industries",
    icons: [
      e("building", "Building", Building),
      e("building-2", "Building 2", Building2),
      e("store", "Store", Store),
      e("factory", "Factory", Factory),
      e("briefcase", "Briefcase", Briefcase),
      e("shopping-bag", "Shopping bag", ShoppingBag),
      e("shopping-cart", "Shopping cart", ShoppingCart),
      e("truck", "Truck", Truck),
      e("plane", "Plane", Plane),
      e("car", "Car", Car),
    ],
  },
  {
    name: "Miscellaneous",
    icons: [
      e("home", "Home", Home),
      e("trash", "Trash", Trash),
      e("trash-2", "Trash 2", Trash2),
      e("copy", "Copy", Copy),
      e("clipboard-copy", "Clipboard", ClipboardCopy),
      e("eye", "Eye", Eye),
      e("eye-off", "Eye off", EyeOff),
      e("filter", "Filter", Filter),
    ],
  },
];

// Flat registry for fast name → component lookup. If two categories define
// the same icon name, the first wins (Suggested takes priority for shared
// defaults).
const BY_NAME = new Map<string, IconEntry>();
for (const cat of ICON_CATEGORIES) {
  for (const icon of cat.icons) {
    if (!BY_NAME.has(icon.name)) BY_NAME.set(icon.name, icon);
  }
}

export function getIcon(name: string): IconEntry | undefined {
  return BY_NAME.get(name);
}

export function getAllIconNames(): string[] {
  return Array.from(BY_NAME.keys());
}

/**
 * Convert a lucide-react icon to a raw SVG string for the snippet export.
 * Reads from the component's static `iconNode` data array (which lucide
 * exposes for exactly this purpose).
 */
type LucideNode = [string, Record<string, string | number>];

export function iconToSvgString(name: string): string {
  const entry = getIcon(name);
  if (!entry) return "";
  // Lucide stamps the icon nodes on the component as `iconNode`.
  // (Not typed in the public types, but stable in practice.)
  const C = entry.Component as unknown as { iconNode?: LucideNode[] };
  const nodes = C.iconNode ?? [];
  const innerSvg = nodes
    .map(([tag, attrs]) => {
      const attrStr = Object.entries(attrs)
        .map(([k, v]) => `${k}="${v}"`)
        .join(" ");
      return `<${tag} ${attrStr}/>`;
    })
    .join("");
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em">${innerSvg}</svg>`;
}

/**
 * Default icon name for each secondary container type. The chip falls
 * back to this when `overlay.iconName` is null.
 */
export const DEFAULT_ICON_FOR_TYPE: Record<string, string> = {
  "single-image": "image",
  signature: "pencil",
  images: "images",
  layers: "layers",
  "text-prompt": "sparkles",
};
