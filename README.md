# T-AIA-901-LIL_3
*The goal of this project is to record a voice signal to predict a path based on 2 points (origin, destination)*

The project is composed 3 major components :
1. A Speech Recognizer to record a voice signal and translate it into a string
2. A Natural Language Processing component to discriminate french sentences and spot the origin point et the destination point
3. A Path Finder to predict a path based on locations

**For now, all of these components are called and chained together in the `main.py` script at the root project folder.**

## Speech recognizer


## Natural Language Processing
In this component, we will mainly use SpaCy, which is a library specialized in NLP
- `data_build` folder gathers all scripts needed to generate some data with web scraping.
- `data` folder gathers pieces of data. The most important file in here is `fr-annotated.json` since it contains all of our generated sentences. Those sentences have been labelized with custom entities in order to train a custom [Named Entity Recognizer](https://spacy.io/api/entityrecognizer) pipe. 
- `land_detector_from_to_model` is our saved trained model. It contains 2 pipes :
  - *detect_lang* to get a prediction on the language being used (based on [spacy_fastlang](https://spacy.io/universe/project/spacy_fastlang))
  - *from_to_location* to retrieve the origin and destination locations
  
The sentences used to feed the NER pipe were labelized using this [NER Annotator for Spacy tool](https://tecoholic.github.io/ner-annotator/).
  
## Path finder
