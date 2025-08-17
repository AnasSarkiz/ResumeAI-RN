import { ManualResumeInput } from '../types/resume';
import {
  classic,
  modern,
  elegant,
  sidebar,
  timeline,
  compactGrid,
  creativeGradient,
  futuristicDarkMode,
  photoHeader,
  softPastel,
} from './templates-part1';
import {
  minimalistColumns,
  boldAccentLine,
  splitBanner,
  modernCardBlocks,
  elegantMonochrome,
  magazineEditorial,
  infographicMinimal,
  asymmetricLayout,
  typographicEmphasis,
  geometricMinimalism,
} from './templates-part2';
import {
  layeredPaper,
  artDecoRevival,
  circularOrbit,
  verticalRibbon,
  diagonalSplit,
  hexagonalGrid,
  neonCyberGrid,
  organicWatercolor,
  isometric3DCity,
  spaceExplorer,
} from './templates-part3';
import {
  abstractGeometric,
  techCircuitBoard,
  minimalMonochrome,
  royalPurple,
  oceanDepth,
  emeraldElegance,
  goldenLuxury,
  sunsetGradient,
  artGallery,
  polaroidMemories,
} from './templates-part4';
import {
  holographicNeon,
  magazineCover,
  blueprintEngineer,
  botanicalFrame,
  retroTerminal,
  origamiFold,
  timelineRail,
  dataDashboard,
  handwrittenNotebook,
  glassMorphism,
} from './templates-part5';

export type TemplateId =
  | 'classic' //1
  | 'modern' //2
  | 'elegant' //3
  | 'sidebar' //4
  | 'timeline' //5
  | 'compactGrid' //6
  | 'creativeGradient' //7
  | 'futuristicDarkMode' //8
  | 'photoHeader' //9
  | 'softPastel' //10
  | 'minimalistColumns' //11
  | 'boldAccentLine' //12
  | 'splitBanner' //13
  | 'modernCardBlocks' //14
  | 'elegantMonochrome' //15
  | 'magazineEditorial' //16
  | 'infographicMinimal' //17
  | 'asymmetricLayout' //18
  | 'typographicEmphasis' //19
  | 'geometricMinimalism' //20
  | 'layeredPaper' //21
  | 'artDecoRevival' //22
  | 'circularOrbit' //23
  | 'verticalRibbon' //24
  | 'diagonalSplit' //25
  | 'hexagonalGrid' //26
  | 'neonCyberGrid' //27
  | 'organicWatercolor' //28
  | 'isometric3DCity' //29
  | 'spaceExplorer' //30
  | 'abstractGeometric' //31
  | 'techCircuitBoard' //32
  | 'minimalMonochrome' //33
  | 'royalPurple' //34
  | 'oceanDepth' //35
  | 'emeraldElegance' //36
  | 'goldenLuxury' //37
  | 'sunsetGradient' //38
  | 'artGallery' //39
  | 'polaroidMemories' //40
  | 'holographicNeon' //41
  | 'magazineCover' //42
  | 'blueprintEngineer' //43
  | 'botanicalFrame' //44
  | 'retroTerminal' //45
  | 'origamiFold' //46
  | 'timelineRail' //47
  | 'dataDashboard' //48
  | 'handwrittenNotebook' //49
  | 'glassMorphism'; //50

export const TEMPLATE_NAMES: Record<TemplateId, string> = {
  classic: 'Classic Professional', //1
  modern: 'Modern Minimal', //2
  elegant: 'Elegant Serif', //3
  sidebar: 'Bold Sidebar', //4
  timeline: 'Timeline Focused', //5
  compactGrid: 'Compact Grid', //6
  creativeGradient: 'Creative Gradient', //7
  futuristicDarkMode: 'Futuristic Dark Mode', //8
  photoHeader: 'Photo Header', //9
  softPastel: 'Soft Pastel', //10
  minimalistColumns: 'Minimalist Columns', //11
  boldAccentLine: 'Bold Accent Line', //12
  splitBanner: 'Split Banner', //13
  modernCardBlocks: 'Modern Card Blocks', //14
  elegantMonochrome: 'Elegant Monochrome', //15
  magazineEditorial: 'Magazine Editorial', //16
  infographicMinimal: 'Infographic Minimal', //17
  asymmetricLayout: 'Asymmetric Layout', //18
  typographicEmphasis: 'Typographic Emphasis', //19
  geometricMinimalism: 'Geometric Minimalism', //20
  layeredPaper: 'Layered Paper', //21
  artDecoRevival: 'Art Deco Revival', //22
  circularOrbit: 'Circular Orbit', //23
  verticalRibbon: 'Vertical Ribbon', //24
  diagonalSplit: 'Diagonal Split', //25
  hexagonalGrid: 'Hexagonal Grid', //26
  neonCyberGrid: 'Neon Cyber Grid', //27
  organicWatercolor: 'Organic Watercolor', //28
  isometric3DCity: 'Isometric 3D City', //29
  spaceExplorer: 'Space Explorer', //30
  abstractGeometric: 'Abstract Geometric', //31
  techCircuitBoard: 'Tech Circuit Board', //32
  minimalMonochrome: 'Minimal Monochrome', //33
  royalPurple: 'Royal Purple', //34
  oceanDepth: 'Ocean Depth', //35
  emeraldElegance: 'Emerald Elegance', //36
  goldenLuxury: 'Golden Luxury', //37
  sunsetGradient: 'Sunset Gradient', //38
  artGallery: 'Art Gallery', //39
  polaroidMemories: 'Polaroid Memories', //40
  holographicNeon: 'Holographic Neon', //41
  magazineCover: 'Magazine Cover', //42
  blueprintEngineer: 'Blueprint Engineer', //43
  botanicalFrame: 'Botanical Frame', //44
  retroTerminal: 'Retro Terminal', //45
  origamiFold: 'Origami Fold', //46
  timelineRail: 'Timeline Rail', //47
  dataDashboard: 'Data Dashboard', //48
  handwrittenNotebook: 'Handwritten Notebook', //49
  glassMorphism: 'Glass Morphism', //50
};

export const renderHTMLTemplate = (resume: ManualResumeInput, template: TemplateId): string => {
  switch (template) {
    case 'classic':
      return classic(resume); //1
    case 'modern':
      return modern(resume); //2
    case 'elegant':
      return elegant(resume); //3
    case 'sidebar':
      return sidebar(resume); //4
    case 'timeline':
      return timeline(resume); //5
    case 'compactGrid':
      return compactGrid(resume); //6
    case 'creativeGradient':
      return creativeGradient(resume); //7
    case 'futuristicDarkMode':
      return futuristicDarkMode(resume); //8
    case 'photoHeader':
      return photoHeader(resume); //9
    case 'softPastel':
      return softPastel(resume); //10
    case 'minimalistColumns':
      return minimalistColumns(resume); //11
    case 'boldAccentLine':
      return boldAccentLine(resume); //12
    case 'splitBanner':
      return splitBanner(resume); //13
    case 'modernCardBlocks':
      return modernCardBlocks(resume); //14
    case 'elegantMonochrome':
      return elegantMonochrome(resume); //15
    case 'geometricMinimalism':
      return geometricMinimalism(resume); //16
    case 'magazineEditorial':
      return magazineEditorial(resume); //17
    case 'infographicMinimal':
      return infographicMinimal(resume); //18
    case 'asymmetricLayout':
      return asymmetricLayout(resume); //19
    case 'typographicEmphasis':
      return typographicEmphasis(resume); //20
    case 'layeredPaper':
      return layeredPaper(resume); //21
    case 'artDecoRevival':
      return artDecoRevival(resume); //22
    case 'circularOrbit':
      return circularOrbit(resume); //23
    case 'verticalRibbon':
      return verticalRibbon(resume); //24
    case 'diagonalSplit':
      return diagonalSplit(resume); //25
    case 'hexagonalGrid':
      return hexagonalGrid(resume); //26
    case 'neonCyberGrid':
      return neonCyberGrid(resume); //27
    case 'organicWatercolor':
      return organicWatercolor(resume); //28
    case 'isometric3DCity':
      return isometric3DCity(resume); //29
    case 'spaceExplorer':
      return spaceExplorer(resume); //30
    case 'abstractGeometric':
      return abstractGeometric(resume); //31
    case 'techCircuitBoard':
      return techCircuitBoard(resume); //32
    case 'minimalMonochrome':
      return minimalMonochrome(resume); //33
    case 'royalPurple':
      return royalPurple(resume); //34
    case 'oceanDepth':
      return oceanDepth(resume); //35
    case 'emeraldElegance':
      return emeraldElegance(resume); //36
    case 'goldenLuxury':
      return goldenLuxury(resume); //37
    case 'sunsetGradient':
      return sunsetGradient(resume); //38
    case 'artGallery':
      return artGallery(resume); //39
    case 'polaroidMemories':
      return polaroidMemories(resume); //40
    case 'holographicNeon':
      return holographicNeon(resume); //41
    case 'magazineCover':
      return magazineCover(resume); //42
    case 'blueprintEngineer':
      return blueprintEngineer(resume); //43
    case 'botanicalFrame':
      return botanicalFrame(resume); //44
    case 'retroTerminal':
      return retroTerminal(resume); //45
    case 'origamiFold':
      return origamiFold(resume); //46
    case 'timelineRail':
      return timelineRail(resume); //47
    case 'dataDashboard':
      return dataDashboard(resume); //48
    case 'handwrittenNotebook':
      return handwrittenNotebook(resume); //49
    case 'glassMorphism':
      return glassMorphism(resume); //50
    default:
      return classic(resume);
  }
};
export const listHTMLTemplates = () =>
  (Object.keys(TEMPLATE_NAMES) as TemplateId[]).map((id) => ({ id, name: TEMPLATE_NAMES[id] }));
