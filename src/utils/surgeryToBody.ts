export enum BodyPart {
  NECK = "neck",
  CHEST = "chest",
  STOMACH = "stomach",
  PELVIC = "pelvic",
  KNEE = "knee",
  BRAIN = "brain",
  LIVER = "liver",
  HIP = "hip",
  SPINE = "spine",
}

export const surgeryToBodyMap: Record<string, BodyPart> = {
  "bilateral thyroidectomy unit": BodyPart.NECK,
  "aortic valve replacement unit": BodyPart.CHEST,
  "graft replacement of aorta unit": BodyPart.CHEST,
  "pda ligation unit": BodyPart.CHEST,
  "exploratory laparotomy unit": BodyPart.STOMACH,
  "laparoscopic cholecystectomy unit": BodyPart.STOMACH,
  "pylorus preserving pancreaticoduodenectomy unit": BodyPart.STOMACH,
  "transurethral resection of prostate unit": BodyPart.PELVIC,
  "prostatectomy unit": BodyPart.PELVIC,
  "total abdominal hysterectomy unit": BodyPart.PELVIC,
  "low cervical cesarean section unit": BodyPart.PELVIC,
  "total hip replacement unit": BodyPart.HIP,
  "total knee replacement unit": BodyPart.KNEE,
  "mastectomy unit": BodyPart.CHEST,
  "craniotomy and removal of brain tumor unit": BodyPart.BRAIN,
  "total gastrectomy unit": BodyPart.STOMACH,
  "wedge resection of liver unit": BodyPart.LIVER,
  "lobectomy of liver unit": BodyPart.LIVER,
  "laminectomy unit": BodyPart.SPINE,
  "liver transplantation unit": BodyPart.LIVER,
};

export const bodyPartToSurgeryMap: Record<BodyPart, string[]> = {
  [BodyPart.NECK]: ["bilateral thyroidectomy"],
  [BodyPart.CHEST]: [
    "aortic valve replacement",
    "graft replacement of aorta",
    "pda ligation",
    "mastectomy",
  ],
  [BodyPart.STOMACH]: [
    "exploratory laparotomy",
    "laparoscopic cholecystectomy",
    "pylorus preserving pancreaticoduodenectomy",
    "total gastrectomy",
  ],
  [BodyPart.PELVIC]: [
    "transurethral resection of prostate",
    "prostatectomy",
    "total abdominal hysterectomy",
    "low cervical cesarean section",
  ],
  [BodyPart.HIP]: ["total hip replacement"],
  [BodyPart.KNEE]: ["total knee replacement"],
  [BodyPart.BRAIN]: ["craniotomy and removal of brain tumor"],
  [BodyPart.LIVER]: [
    "wedge resection of liver",
    "lobectomy of liver",
    "liver transplantation",
  ],
  [BodyPart.SPINE]: ["laminectomy"],
};
