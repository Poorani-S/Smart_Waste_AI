WASTE_INFO = {
    "Plastic": {
        "type": "Recyclable / Dry Waste",
        "description": "Synthetic materials made from polymers, such as water bottles, bags, and food containers.",
        "examples": ["PET bottles", "Plastic bags", "Containers", "Wrappers"],
        "disposal": "Clean out any food residue and place in the designated plastics recycling bin. Avoid mixing with organic waste.",
        "environmental_note": "Plastic takes hundreds of years to decompose and can break down into harmful microplastics if not recycled properly."
    },
    "Paper": {
        "type": "Recyclable / Dry Waste",
        "description": "Material manufactured in thin sheets from the pulp of wood or other fibrous substances.",
        "examples": ["Newspapers", "Cardboard boxes", "Magazines", "Office paper"],
        "disposal": "Keep dry and clean. Do not recycle paper heavily soiled with food (e.g., greasy pizza boxes). Place in the paper recycling bin.",
        "environmental_note": "Recycling paper saves trees and significantly reduces water and energy consumption compared to producing new paper."
    },
    "Metal": {
        "type": "Recyclable / Dry Waste",
        "description": "Solid materials typically hard, shiny, and featuring good electrical and thermal conductivity.",
        "examples": ["Aluminum cans", "Steel food tins", "Foil", "Scrap metal"],
        "disposal": "Rinse out cans to remove food residue. Place in the metal or mixed recycling bin. Sharp edges should be pushed inside the can.",
        "environmental_note": "Metals like aluminum can be recycled infinitely without losing quality, saving up to 95% of the energy needed to make new metal."
    },
    "Glass": {
        "type": "Recyclable / Dry Waste",
        "description": "Hard, brittle substance typically transparent or translucent, made from fusing sand with soda and lime.",
        "examples": ["Beverage bottles", "Food jars", "Broken window glass (varies)"],
        "disposal": "Rinse out containers. Handle broken glass carefully by wrapping it securely before disposal. Do not mix drinking glasses or ceramics with container glass.",
        "environmental_note": "Glass is 100% recyclable and can be reused endlessly without loss in quality or purity."
    },
    "Organic": {
        "type": "Compostable / Wet Waste",
        "description": "Biodegradable waste that comes from plants or animals.",
        "examples": ["Fruit peels", "Vegetable scraps", "Coffee grounds", "Eggshells", "Yard trimmings"],
        "disposal": "Place in the compost bin or green/organic waste bin. Do not include plastic bags, glass, or metals.",
        "environmental_note": "Composting organic waste reduces landfill methane emissions and produces nutrient-rich soil for agriculture."
    }
}

def get_waste_info(category):
    return WASTE_INFO.get(category, {
        "type": "Unknown",
        "description": "No information available for this category.",
        "examples": [],
        "disposal": "Follow local guidelines for disposal.",
        "environmental_note": "Proper waste segregation is crucial for the environment."
    })
