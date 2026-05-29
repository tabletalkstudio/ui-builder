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

/**
 * An icon registry entry. Two variants:
 *   - `lucide`: a lucide-react component (default visual language).
 *   - `svg`: a raw inner-SVG string we render with dangerouslySetInnerHTML.
 *     Used for brand icons that lucide-react doesn't ship (GitHub, X, etc.)
 *     or for any icon you want pixel-exact.
 *
 * Both variants render at 1em × 1em (the chip sizes them via CSS).
 */
export type IconEntry = {
  name: string; // kebab-case identifier we store in state
  label: string; // human-readable label
} & (
  | { kind: "lucide"; Component: LucideIcon }
  | {
      kind: "svg";
      /** Inner SVG content (children only — wrapped in <svg viewBox="..."> at render time). */
      svg: string;
      /** viewBox attribute (defaults to "0 0 24 24" to match lucide). */
      viewBox?: string;
      /** Stroke/fill mode; defaults to "stroke" (matches lucide). "fill" suits filled brand marks. */
      mode?: "stroke" | "fill";
    }
);

export type IconCategory = {
  name: string;
  icons: IconEntry[];
};

const e = (name: string, label: string, C: LucideIcon): IconEntry => ({
  name,
  label,
  kind: "lucide",
  Component: C,
});

/** Helper for adding a raw-SVG brand or custom icon to the registry. */
const svg = (
  name: string,
  label: string,
  innerSvg: string,
  opts: { viewBox?: string; mode?: "stroke" | "fill" } = {},
): IconEntry => ({
  name,
  label,
  kind: "svg",
  svg: innerSvg,
  viewBox: opts.viewBox,
  mode: opts.mode ?? "fill",
});

/* ---------------------------------------------------------------------------
   Brand SVG icons. Path data sourced from Simple Icons (CC0). Each entry's
   `svg` string is the children of an <svg>, and rendered at 1em × 1em.
   --------------------------------------------------------------------------- */

const BRAND_SVGS = {
  github: `<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>`,
  x: `<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>`,
  twitter: `<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>`,
  youtube: `<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>`,
  linkedin: `<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>`,
  tiktok: `<path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.66 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.7-.1z"/>`,
  instagram: `<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>`,
  threads: `<path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.781 3.631 2.695 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.81-1.74-.6-.563-1.534-.84-2.776-.84a4.4 4.4 0 0 0-3.62 1.785l-1.732-1.16c.99-1.464 2.62-2.626 5.353-2.626 1.84 0 3.301.59 4.27 1.55.967.94 1.486 2.296 1.486 4.025 1.49.583 2.564 1.484 3.158 2.83.97 2.2.97 4.999-1.49 7.405-1.79 1.751-3.953 2.522-6.86 2.55Zm1.27-9.84a8.6 8.6 0 0 0-1.286-.092c-.59 0-1.117.06-1.557.179-1.225.331-1.917.97-1.85 1.71.066.738.732 1.179 1.728 1.179 1.32 0 2.24-.405 2.81-1.236.359-.526.566-1.16.609-1.74z"/>`,
} as const;

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
    name: "Social media",
    icons: [
      svg("github", "GitHub", BRAND_SVGS.github),
      svg("x", "X", BRAND_SVGS.x),
      svg("twitter", "Twitter (legacy)", BRAND_SVGS.twitter),
      svg("youtube", "YouTube", BRAND_SVGS.youtube),
      svg("linkedin", "LinkedIn", BRAND_SVGS.linkedin),
      svg("tiktok", "TikTok", BRAND_SVGS.tiktok),
      svg("instagram", "Instagram", BRAND_SVGS.instagram),
      svg("threads", "Threads", BRAND_SVGS.threads),
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
 * Convert any registry icon to a raw SVG string for the snippet export.
 * Handles both lucide and inline-SVG entries with identical output shape
 * (wrapping <svg> attributes vary by mode).
 */
type LucideNode = [string, Record<string, string | number>];

export function iconToSvgString(name: string): string {
  const entry = getIcon(name);
  if (!entry) return "";

  if (entry.kind === "svg") {
    const viewBox = entry.viewBox ?? "0 0 24 24";
    const fillStrokeAttrs =
      entry.mode === "stroke"
        ? `fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`
        : `fill="currentColor"`;
    return `<svg viewBox="${viewBox}" ${fillStrokeAttrs} width="1em" height="1em">${entry.svg}</svg>`;
  }

  // Lucide stamps the icon nodes on the component as `iconNode`.
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
