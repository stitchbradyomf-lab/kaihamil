# Relationship Knowledge Graph

Visual map of Kyle's people network. Edit as people are added/discovered.

## Family Graph (Mermaid)

```mermaid
graph TD
  KYLE[Kyle Brady<br/>b. 1985-04-03]
  MARISSA[Marissa Brady<br/>wife]
  HUDSON[Hudson<br/>son]
  ROWAN[Rowan<br/>daughter, 10<br/>b. 2016-07-03]
  DYLAN[Dylan<br/>daughter, 6<br/>b. 2020-05-11]

  MOM[Kyle's Mom<br/>70 in 2026]
  DAD[Kyle's Dad]
  ELISE[Elise<br/>sister]
  STEVE[Steve<br/>brother-in-law]
  BRADY_N[Brady<br/>nephew, ~3]

  GRANDPA_M[Grandpa<br/>Marissa's dad]
  JOJO[Joanne / JoJo<br/>Marissa's mom]

  UNCLE_J[Uncle Jeremy<br/>Kyle's dad's brother]
  TOMMY[Tommy<br/>cousin, 15]

  AUNT_M[Mom's sister<br/>Kyle's aunt]
  ROSS[Ross<br/>cousin]
  EMILY[Emily<br/>former neighbor<br/>now Ross's wife]
  CAMPBELL[Campbell, 6]
  ELLISON[Ellison, 3]

  MOM_BF[Mom's boyfriend]

  KYLE -- spouse --> MARISSA
  KYLE -- parent --> HUDSON
  KYLE -- parent --> ROWAN
  KYLE -- parent --> DYLAN

  MARISSA -- parent --> HUDSON
  MARISSA -- parent --> ROWAN
  MARISSA -- parent --> DYLAN
  MARISSA -- child of --> GRANDPA_M
  MARISSA -- child of --> JOJO

  MOM -- parent --> KYLE
  MOM -- parent --> ELISE
  MOM -- former spouse --> DAD
  MOM -- close to --> UNCLE_J
  MOM -- partner --> MOM_BF
  MOM -- sibling --> AUNT_M

  DAD -- parent --> KYLE
  DAD -- parent --> ELISE
  DAD -- sibling --> UNCLE_J

  ELISE -- spouse --> STEVE
  ELISE -- parent --> BRADY_N
  STEVE -- parent --> BRADY_N

  UNCLE_J -- parent --> TOMMY

  AUNT_M -- parent --> ROSS
  ROSS -- spouse --> EMILY
  ROSS -- parent --> CAMPBELL
  ROSS -- parent --> ELLISON
  EMILY -- parent --> CAMPBELL
  EMILY -- parent --> ELLISON
  EMILY -- former neighbor of --> KYLE

  classDef immediate fill:#fde68a,stroke:#92400e,color:#000
  classDef kyleside fill:#bfdbfe,stroke:#1e40af,color:#000
  classDef marissaside fill:#bbf7d0,stroke:#166534,color:#000
  classDef extended fill:#e9d5ff,stroke:#6b21a8,color:#000

  class KYLE,MARISSA,HUDSON,ROWAN,DYLAN immediate
  class MOM,DAD,ELISE,STEVE,BRADY_N,MOM_BF kyleside
  class GRANDPA_M,JOJO marissaside
  class UNCLE_J,TOMMY,AUNT_M,ROSS,EMILY,CAMPBELL,ELLISON extended
```

## Key Insights

### Kyle as Connective Tissue
- Ross + Emily met at Kyle's house (Emily was his next-door neighbor)
- They connected at Kyle's wedding
- Now married with 2 kids
- Pattern: Kyle's spaces and events create relationships that outlast the original moment

### Cross-Divorce Continuity
- Kyle's parents are divorced
- Kyle's mom remains very close with Uncle Jeremy (Kyle's dad's brother) and his family
- This works smoothly — children/grandchildren see both sides without conflict
- Pattern: Relationships maintained through deliberate choice, not obligation

### Three-Generation Hosting
- Kyle and Marissa frequently host multi-family, multi-generational gatherings
- LBI 2026: Mom (70) + Marissa's dad (Grandpa) + siblings + cousins + cousins' kids
- They're not attending family events — they're *building the infrastructure* for them

## Next To Add
- Marissa's siblings (if any)
- Hudson's birthday / age
- Kyle's wider friend circle
- Bloomberg / professional network
- Kai Hamil collaborators
